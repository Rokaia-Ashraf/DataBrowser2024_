define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "esri/graphicsUtils",
  "esri/geometry/Polygon",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/graphic",
  "esri/Color",
], function (
  declare,
  BaseWidget,
  graphicsUtils,
  Polygon,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleRenderer,
  Graphic,
  Color
) {
  return declare([BaseWidget], {
    baseClass: "jimu-widget-region-filter",
    regions: [],
    govs: [],
    domains: [],
    markazes: [],
    sheakhas: [],
    spatialReferences: {},

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this.inherited(arguments);
      this.loadRegions();
      this.loadDomains();
      var self = this;
      $("#regions").change(function () {
        var val = $(this).val();
        self.clearGov();
        self.loadGovs(val);
        self.renderRegion(val);
      });

      $("#govs").change(function () {
        var val = $(this).val();
        self.clearMarkaz();
        self.loadMarkazes(val);
        self.renderGov(val);
      });

      $("#markazes").change(function () {
        var val = $(this).val();
        self.clearSheakha();
        self.loadSheakha(val);
        self.renderMarkaz(val);
      });

      $("#sheakhas").change(function () {
        var val = $(this).val();
        self.renderSheakha(val);
      });
    },
    clearGov: function () {
      var self = this;
      $("#govs option").remove();
      $("#govs").append('<option value="">الكل</option>');
      self.clearMarkaz();
    },
    clearMarkaz: function () {
      var self = this;
      $("#markazes option").remove();
      $("#markazes").append('<option value="">الكل</option>');
      self.clearSheakha();
    },
    clearSheakha: function () {
      $("#sheakhas option").remove();
      $("#sheakhas").append('<option value="">الكل</option>');
    },
    loadRegions: function () {
      $("#regions option").remove();
      $("#regions").append('<option value="">الكل</option>');
      var url = this.appConfig?.filterConfig?.regionlayer?.url;
      if (url) {
        this.regions = [];
        var self = this;
        $.get(url, function (data) {
          var features = JSON.parse(data);
          self.spatialReferences["region"] = {
            latestWkid: features.spatialReference?.latestWkid,
            wkid: features.spatialReference?.wkid,
          };
          features.features.forEach((element) => {
            self.regions.push(element);
            $("#regions").append(
              '<option value="' +
                element.attributes.Region_GCode +
                '">' +
                element.attributes.Region_Name +
                "</option>"
            );
          });
        });
      }
    },
    loadDomains() {
      this.domains = [];
      var self = this;
      var domainQuery = this.appConfig?.filterConfig?.govLayer?.domainQuery;
      if (domainQuery) {
        $.get(domainQuery, function (data) {
          var domains = JSON.parse(data);
          domains.domains[0].codedValues.forEach((element) => {
            self.domains.push(element);
          });
        });
      }
    },
    renderRegion: function (val) {
      var self = this;
      this.map.graphics.clear();
      if (val) {
        var index = self.regions.findIndex((r) => {
          return r.attributes.Region_GCode == val;
        });
        if (index >= 0) {
          self.zoomAndHighLight(self.regions[index].geometry, "region");
        }
      }
    },
    loadGovs: function (val) {
      this.govs = [];
      var self = this;
      var url = self.appConfig?.filterConfig?.govLayer?.url;
      if (url) {
        url += val ? "&where=Region_GCode='" + val + "'" : "&where=1=1";
        $.get(url, function (data) {
          var features = JSON.parse(data);
          self.spatialReferences["gov"] = {
            latestWkid: features.spatialReference?.latestWkid,
            wkid: features.spatialReference?.wkid,
          };
          features.features.forEach((element) => {
            var index = self.domains.findIndex((x) => {
              return x.code == element.attributes.Gov_Name;
            });
            if (index >= 0) {
              element.name = self.domains[index].name;

              $("#govs").append(
                '<option value="' +
                  element.attributes.Gov_GCode +
                  '">' +
                  element.name +
                  "</option>"
              );
            }
            self.govs.push(element);
          });
        });
      }
    },
    renderGov: function (val) {
      var self = this;
      this.map.graphics.clear();
      if (val) {
        var index = self.govs.findIndex((r) => {
          return r.attributes.Gov_GCode == val;
        });
        if (index >= 0) {
          self.zoomAndHighLight(self.govs[index].geometry, "gov");
        }
      }
    },
    loadMarkazes: function (val) {
      this.markazes = [];
      var self = this;
      var url = self.appConfig?.filterConfig?.markazLayer?.url;
      if (url) {
        url += val ? "&where=Gov_GCode='" + val + "'" : "&where=1=1";
        $.get(url, function (data) {
          var features = JSON.parse(data);
          self.spatialReferences["markaz"] = {
            latestWkid: features.spatialReference?.latestWkid,
            wkid: features.spatialReference?.wkid,
          };
          features.features.forEach((element) => {
            $("#markazes").append(
              '<option value="' +
                element.attributes.Markaz_GCode +
                '">' +
                element.attributes.Markaz_Name +
                "</option>"
            );
            self.markazes.push(element);
          });
        });
      }
    },
    renderMarkaz: function (val) {
      var self = this;
      this.map.graphics.clear();
      if (val) {
        var index = self.markazes.findIndex((r) => {
          return r.attributes.Markaz_GCode == val;
        });
        if (index >= 0) {
          self.zoomAndHighLight(self.markazes[index].geometry, "markaz");
        }
      }
    },
    loadSheakha: function (val) {
      this.sheakhas = [];
      var self = this;
      var url = self.appConfig?.filterConfig?.sheakhaLayer?.url;
      if (url) {
        url += val ? "&where=Markaz_GCode='" + val + "'" : "&where=1=1";
        $.get(url, function (data) {
          var features = JSON.parse(data);
          self.spatialReferences["sheakha"] = {
            latestWkid: features.spatialReference?.latestWkid,
            wkid: features.spatialReference?.wkid,
          };
          features.features.forEach((element) => {
            $("#sheakhas").append(
              '<option value="' +
                element.attributes.Shiakha_GCode +
                '">' +
                element.attributes.Shiakha_Name +
                "</option>"
            );
            self.sheakhas.push(element);
          });
        });
      }
    },
    renderSheakha: function (val) {
      var self = this;
      this.map.graphics.clear();
      if (val) {
        var index = self.sheakhas.findIndex((r) => {
          return r.attributes.Shiakha_GCode == val;
        });
        if (index >= 0) {
          self.zoomAndHighLight(self.sheakhas[index].geometry, "sheakha");
        }
      }
    },

    zoomAndHighLight: function (geometry, level) {
      this.map.graphics.clear();
      var highlightSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([34, 214, 40]),
          3
        ),
        new Color([125, 125, 125, 0])
      );
      let self = this;
      debugger;
      const wkid = level ? self.spatialReferences[level].wkid : 102100;
      const latestWkid = level
        ? self.spatialReferences[level].latestWkid
        : 3857;
      var polygon = new Polygon({
        rings: geometry.rings,
        spatialReference: {
          wkid: wkid,
          latestWkid: 102100,
        },
      });
      var highlightGraphic = new Graphic(polygon, highlightSymbol);
      this.map.graphics.add(highlightGraphic);
      this.map.setExtent(polygon.getExtent());
    },
    onSignIn: function (credential) {
      console.log("onSignInHeader");
      console.log(credential);
    },

    onSignOut: function () {
      console.log("onSignOutHeader");
    },
  });
});
