class Otodom {
  constructor() {
    this.rows = document.querySelectorAll("li[data-cy='listing-item']");
    this.getAdData();
  }

  async getAdData() {
    return await chrome.storage.local.get("advertisementsData", (result) => {
      this.ads = result.advertisementsData || {};
      this.adIds = Object.keys(this.ads);
      console.log("advertisementsData", result.advertisementsData);
      const match = window.location.href.match(/-ID(.+)/);

      if (match && match[1]) {
        this.preapreDetailsPage(match[1]);
      } else {
        this.preapreAdRows();
      }
    });
  }

  preapreAdRows() {
    this.rows.forEach((row) => {
      this.showTotalPrice(row);
      this.handleViewIconForRow(row);
    });
  }

  showTotalPrice(row) {
    try {
      const spans = [...row.querySelectorAll("span")];
      const priceStr = spans
        .find((s) => /zł\/mc/.test(s.innerText))
        .innerText.replace(/\D/g, "");

      const chynsh = spans
        .find((s) => /czynsz/.test(s.innerText))
        .innerText.replace(/\D/g, "");

      const totalPrice = chynsh
        ? parseInt(priceStr) + parseInt(chynsh)
        : parseInt(priceStr);

      const priceContainer = row.querySelector("article");
      appendHtmlElement(
        "div",
        priceContainer,
        "",
        {
          innerText: chynsh
            ? `${totalPrice} zł/mc`
            : `${totalPrice} + ??? zł/mc`,
        },
        { font: "bold 22px Arial", color: "red" }
      );
    } catch (e) {
      console.log("can't calculate price", e.message);
    }
  }

  handleViewIconForRow(row) {
    try {
      const adId = row.querySelector("a").href.match(/-ID(.+)/)[1];
      const isViewed = this.adIds.includes(adId);

      if (isViewed) {
        row.querySelector("article").style.background = "lightgray";
      } else {
        row.querySelector("article").style.background = "white";
      }

      const container = row.querySelector("article div");
      container.querySelector(".add-to-viewed")?.remove();
      const btn = appendHtmlElement("button", container, "add-to-viewed", {
        innerText: isViewed ? "👀" : "✅",
      });

      this.setAddToViewedHandler(btn, adId, isViewed, () => {
        this.handleViewIconForRow(row);
      });
    } catch (e) {
      console.log("can't show view icon", e.message);
    }
  }

  preapreDetailsPage(adId) {
    this.handleViewIcon(adId);
  }

  handleViewIcon(adId) {
    try {
      const isViewed = this.adIds.includes(adId);

      const container = document.querySelector(
        "[data-cy='ad-page-sticky-header-area-contact-modal']"
      ).parentElement;

      container.querySelector(".add-to-viewed")?.remove();
      const btn = appendHtmlElement(
        "button",
        container,
        "add-to-viewed",
        {
          innerText: isViewed ? "👀" : "✅",
        },
        { width: "100px" }
      );

      this.setAddToViewedHandler(btn, adId, isViewed, () => {
        this.handleViewIcon(adId);
      });
    } catch (e) {
      console.log("can't show view icon", e.message);
    }
  }

  setAddToViewedHandler(btn, adId, isViewed, callback) {
    btn.addEventListener(
      "click",
      (e) => {
        console.log(adId);
        e.stopPropagation();
        e.preventDefault();
        isViewed ? this.deleteAd(adId) : this.createAd(adId);
        if (callback) callback();
      },
      false
    );
  }

  createAd(id, data = {}) {
    this.ads[id] = data;
    this.adIds = Object.keys(this.ads);
    chrome.storage.local.set({
      advertisementsData: this.ads,
    });
  }

  deleteAd(id) {
    delete this.ads[id];
    this.adIds = Object.keys(this.ads);
    chrome.storage.local.set({
      advertisementsData: this.ads,
    });
  }
}

new Otodom();
