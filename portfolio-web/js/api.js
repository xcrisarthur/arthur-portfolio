(function () {
  function apiBase() {
    return (window.PORTFOLIO_API || "").replace(/\/+$/, "");
  }

  function getToken() {
    try {
      return sessionStorage.getItem("portfolio_token") || "";
    } catch {
      return "";
    }
  }

  function setToken(token) {
    try {
      if (token) sessionStorage.setItem("portfolio_token", token);
      else sessionStorage.removeItem("portfolio_token");
    } catch (_) {}
  }

  async function request(path, options) {
    options = options || {};
    var headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    var token = getToken();
    if (token) headers.Authorization = "Bearer " + token;
    var res = await fetch(apiBase() + path, {
      method: options.method || "GET",
      headers: headers,
      body: options.body != null ? JSON.stringify(options.body) : undefined
    });
    var data = {};
    try {
      data = await res.json();
    } catch (_) {}
    if (!res.ok) {
      var err = new Error(data.error || "request_failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  window.PortfolioApi = {
    getPortfolio: function () {
      return request("/api/portfolio").then(function (r) {
        return r.data;
      });
    },
    login: function (username, password) {
      return request("/api/auth/login", {
        method: "POST",
        body: { username: username, password: password }
      }).then(function (r) {
        setToken(r.token);
        return r;
      });
    },
    logout: function () {
      setToken("");
    },
    checkAuth: function () {
      return request("/api/auth/me");
    },
    savePortfolio: function (data) {
      return request("/api/portfolio", { method: "PUT", body: { data: data } });
    },
    uploadMedia: function (dataUrl) {
      return request("/api/media", { method: "POST", body: { data: dataUrl } });
    },
    deleteMedia: function (id) {
      return request("/api/media/" + encodeURIComponent(id), { method: "DELETE" });
    },
    getToken: getToken,
    setToken: setToken
  };
})();
