const URL = require("../models/url");

// To create a new shortened URL
// This function generates a new short URL and stores it in the database along with the original URL.
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const { nanoid } = await import("nanoid");
  try {
    const shortId = nanoid(8);

    await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.render("home", {
      id: shortId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to generate short URL", details: error.message });
  }
}

// To visit the site by shortId generated Example -MAKE GET Request http://localhost:8001/url/:shortId
// This function handles the redirection of a short URL to the original URL.
// It also logs the visit by adding a timestamp to the 'visitHistory' of the URL entry.
async function handleVisitSite(req, res) {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
  
    if (!entry) {
      return res.status(404).json({ error: "Short URL not found " });
    }
  
    res.redirect(entry.redirectURL);
    
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

// To get analytics for a shortened URL
// This function retrieves the total number of visits and the visit history for a given short URL.
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  
  try {

    const result = await URL.findOne({ shortId });
    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }
  
    return res.json({
      totalClicks: result.visitHistory.length,
      analysis: result.visitHistory,
    });
    
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve analytics", details: error.message });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleVisitSite,
};
