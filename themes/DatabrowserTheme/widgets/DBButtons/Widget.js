define(['dojo/_base/declare', 'jimu/BaseWidget', "jimu/WidgetManager"],
  function (declare, BaseWidget, WidgetManager) {
    return declare([BaseWidget], {
      baseClass: 'jimu-widget-db-buttons',
      postCreate: function () {
        this.inherited(arguments);
        this.self = this;
      },
      startup: function () {
        this.inherited(arguments);
        this.wm = WidgetManager.getInstance();
        this.gallery = false;
        this.summary = false;
        this._initUI();
      },
      _initUI: function () {
        var basemapGalleryNode = this.basemapGalleryNode;
        var summaryNode = this.summaryNode;
        var nodeSelf = this;
        $(function () {
          function reset(self) {
            $('.db-buttons').css('bottom', '20px');
            $('.db-buttons .item').not(self).removeClass('active');
            $('.content.statistics').hide();
            $('.content.gallery').hide();
            nodeSelf.wm.getWidgetById("widgets_AttributeTable_Widget")._closeTable();
            self.toggleClass('active');
          }
          $('.item.table').click(function () {
            reset($(this));

            if ($(this).hasClass('active')) {
              nodeSelf.wm.getWidgetById("widgets_AttributeTable_Widget")._openTable();
            }
          });

          $('.item.gallery').click(function () {
            reset($(this));
            if ($(this).hasClass('active')) {
              if (!nodeSelf.gallery)
                nodeSelf.wm.loadWidget({ "uri": "widgets/BaseMapGallery/Widget", "config": "configs/BasemapGallery/config__5.json" }).then(function (widget) { nodeSelf.gallery = true; widget.placeAt(basemapGalleryNode); });
              $('.content.gallery').show();
              $('.db-buttons').css('bottom', $('.content.gallery').height() + 'px');
            }
          });
          $('.item.statistics').click(function () {
            reset($(this));
            if ($(this).hasClass('active')) {
              if (!nodeSelf.summary)
                nodeSelf.wm.loadWidget({ "uri": "widgets/Summary/Widget", "config": "configs/Summary/config__6.json" }).then(function (widget) { nodeSelf.summary = true; widget.placeAt(summaryNode); });
              $('.content.statistics').show();
              $('.db-buttons').css('bottom', $('.content.statistics').height() + 'px');
            }
          });
        });
      }
    });
  });