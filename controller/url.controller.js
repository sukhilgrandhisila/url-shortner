const { redisClient } = require("../config/redis");

const Url = require("../model/url.model");
const {nanoid} = require("nanoid");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "Original URL is missing",
      });
    }

    const shortCode = nanoid(6);

    // FIX: Changed URL to Url
    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user: req.user?.userId,
    });

    return res.status(201).json({
      id: newUrl._id,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    });
  } catch (error) {
    console.error("Create URL Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOneAndUpdate(
      { shortCode },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
    );

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserUrls = async (req, res) => {
  try {
    const start = Date.now();
    const userId = req.user.userId;
    const cacheKey = `user:${userId}:urls`;

    // 1️⃣ Redis check (FAST PATH)
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
      // console.log("Parse time:", Date.now() - parseStart, "ms");
    }

    // 2️⃣ DB query (OPTIMIZED)
    const urls = await Url.find({ user: userId })
      .select("shortCode originalUrl") // only required fields
      .lean(); // removes mongoose overhead

    // 3️⃣ Cache result (NON-BLOCKING)
    redisClient.set(cacheKey, JSON.stringify(urls), {
      EX: 300, // 5 min
    });
    return res.json(urls);
    
  } catch (error) {
    console.error("Get URLs Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserUrls };

const deleteUrl = async (req, res) => {
  try {
    const deletedUrl = await Url.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedUrl) {
      return res.status(404).json({
        message: "URL not found or unauthorized to delete",
      });
    }

    res.json({ message: "URL deleted" });
  } catch (error) {
    console.error("Delete URL Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleGetAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const result = await Url.findOne({ shortCode: shortId });
  console.log(result);
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

module.exports = {
  createShortUrl,
  redirectUrl,
  getUserUrls,
  deleteUrl,
  handleGetAnalytics,
};
