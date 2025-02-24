const playdl = require("play-dl");

// Use your extracted cookies
playdl.setToken({
    youtube: {
        cookie: "VISITOR_INFO1_LIVE=your_cookie_here; YSC=your_cookie_here",
    }
});
