const Roadmap = require("../models/Roadmap");
const youtubesearchapi = require("youtube-search-api");

// In-memory cache to prevent video order shifting and reduce API calls
// Format: { [domain]: { timestamp: number, videos: Array } }
const videoCache = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

exports.getRoadmapByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    const roadmap = await Roadmap.findOne({ domain });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoadmapVideos = async (req, res) => {
  try {
    const { domain } = req.params;
    if (!domain || domain === "Not Selected") {
      return res.status(400).json({ message: "Invalid domain" });
    }

    // Check Cache First
    const now = Date.now();
    if (videoCache[domain] && (now - videoCache[domain].timestamp < CACHE_DURATION)) {
      return res.json({ videos: videoCache[domain].videos });
    }

    // Prepare tier-specific search queries
    const begQuery = `${domain} full course tutorial for beginners basics`;
    const intQuery = `${domain} intermediate course tutorial project`;
    const advQuery = `${domain} advanced masterclass concepts deep dive`;

    // Search youtube in parallel (buffer to 10 results each to account for duplicates)
    const [begResult, intResult, advResult] = await Promise.all([
      youtubesearchapi.GetListByKeyword(begQuery, false, 10, [{ type: "video" }]),
      youtubesearchapi.GetListByKeyword(intQuery, false, 10, [{ type: "video" }]),
      youtubesearchapi.GetListByKeyword(advQuery, false, 10, [{ type: "video" }])
    ]);

    // Helper to extract clean video data
    const extractVideos = (resultData) => {
      if (!resultData || !resultData.items) return [];
      return resultData.items.map(item => ({
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail.thumbnails && item.thumbnail.thumbnails.length > 0
          ? item.thumbnail.thumbnails[0].url
          : "", // fallback
        channelTitle: item.channelTitle,
        length: item.length?.simpleText || ""
      }));
    };

    const extractedBeg = extractVideos(begResult);
    const extractedInt = extractVideos(intResult);
    const extractedAdv = extractVideos(advResult);

    const seenIds = new Set();

    // Sequential uniqueness filter picking exactly `count` items
    const getUniqueVideos = (sourceList, count) => {
      const selected = [];
      for (const vid of sourceList) {
        if (!seenIds.has(vid.id)) {
          selected.push(vid);
          seenIds.add(vid.id);
          if (selected.length === count) break;
        }
      }
      return selected;
    };

    const begVideos = getUniqueVideos(extractedBeg, 4);
    const intVideos = getUniqueVideos(extractedInt, 4);
    const advVideos = getUniqueVideos(extractedAdv, 4);

    // Concatenate into exactly 12 items (or as close as possible depending on strict duplicates)
    const videos = [...begVideos, ...intVideos, ...advVideos];

    // Cache the frozen sequence to prevent shifting on reload
    videoCache[domain] = { timestamp: now, videos };

    res.json({ videos });
  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch differentiated videos" });
  }
};