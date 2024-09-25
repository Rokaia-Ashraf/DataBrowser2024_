// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://@sbaseurl@/jsapi/jsapi/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
require({
  cache: {
    "jimu/dijit/LayerChooserFromMapWithDropbox": function () {
      define(
        "dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/on dojo/Evented dojo/Deferred dijit/popup dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./templates/LayerChooserFromMapWithDropbox.html jimu/LayerInfos/LayerInfos".split(
          " "
        ),
        function (g, m, k, l, d, c, f, h, v, w, q) {
          return g([h, v, d], {
            templateString: w,
            baseClass: "jimu-layer-chooser-from-map-withdropbox",
            declaredClass: "jimu.dijit.LayerChooserFromMapWithDropbox",
            _selectedItem: null,
            _isLayerChooserShow: !1,
            layerInfosObj: null,
            layerChooser: null,
            postCreate: function () {
              this.inherited(arguments);
              this.layerInfosObj = q.getInstanceSync();
              this.layerChooser.domNode.style.zIndex = 1;
              this.layerChooser.tree.domNode.style.borderTop = "0";
              this.layerChooser.tree.domNode.style.maxHeight = "290px";
              this.own(
                l(
                  this.layerChooser,
                  "tree-click",
                  m.hitch(this, this._onTreeClick)
                )
              );
              this.own(
                l(
                  this.layerChooser,
                  "update",
                  m.hitch(this, this._onLayerChooserUpdate)
                )
              );
              this.own(
                l(document.body, "click", m.hitch(this, this._onBodyClicked))
              );
            },
            destroy: function () {
              this.hideLayerChooser();
              this.layerChooser && this.layerChooser.destroy();
              this.layerChooser = null;
              this.inherited(arguments);
            },
            getLayerChooser: function () {
              return this.layerChooser;
            },
            setSelectedLayer: function (a) {
              var f = new c();
              if (a) {
                var d = this.layerInfosObj.getLayerInfoById(a.id);
                d
                  ? this.layerChooser.filter(d).then(
                      m.hitch(this, function (c) {
                        c
                          ? (this._onSelectNewItem({
                              layerInfo: d,
                              name: d.title,
                              url: a.url,
                            }),
                            f.resolve(!0))
                          : f.resolve(!1);
                      }),
                      m.hitch(this, function () {
                        f.resolve(!1);
                      })
                    )
                  : f.resolve(!1);
              } else this._onSelectNewItem(null), f.resolve(!0);
              return f;
            },
            getSelectedItem: function () {
              return this._selectedItem;
            },
            getSelectedItems: function () {
              return [this._selectedItem];
            },
            _onBodyClicked: function (a) {
              a = a.target || a.srcElement;
              a === this.domNode ||
                k.isDescendant(a, this.domNode) ||
                a === this.layerChooser.domNode ||
                k.isDescendant(a, this.layerChooser.domNode) ||
                this.hideLayerChooser();
            },
            _onDropDownClick: function (a) {
              a.stopPropagation();
              a.preventDefault();
              this._isLayerChooserShow
                ? this.hideLayerChooser()
                : this.showLayerChooser();
            },
            _getSelectedItems: function () {
              return this.layerChooser.getSelectedItems();
            },
            showLayerChooser: function () {
              this.layerChooser.domNode.style.minWidth =
                this.domNode.clientWidth + 2 + "px";
              f.open({
                parent: this,
                popup: this.layerChooser,
                around: this.domNode,
              });
              var a = this.layerChooser.domNode.parentNode;
              a &&
                k.addClass(a, "jimu-layer-chooser-from-map-withdropbox-popup");
              this._isLayerChooserShow = !0;
            },
            hideLayerChooser: function () {
              f.close(this.layerChooser);
              this._isLayerChooserShow = !1;
            },
            _onLayerChooserUpdate: function () {
              this._selectedItem &&
                this.layerChooser.onlyShowVisible &&
                !this._selectedItem.layerInfo.isShowInMap() &&
                ((this._selectedItem = null),
                this.emit("selection-change", []));
            },
            _onSelectNewItem: function (a) {
              var c = m.getObject("layerInfo.id", !1, this._selectedItem) || -1,
                f = m.getObject("layerInfo.id", !1, a) || -1,
                c = c !== f;
              this._selectedItem = a;
              this.hideLayerChooser();
              a = m.getObject("layerInfo.title", !1, this._selectedItem) || "";
              this.layerNameNode.innerHTML = a;
              k.setAttr(this.layerNameNode, "title", a);
              a = m.getObject("layerInfo.layerObject", !1, this._selectedItem);
              c && this.emit("selection-change", [a]);
            },
            _onTreeClick: function () {
              var a = this._getSelectedItems();
              this._onSelectNewItem(0 < a.length ? a[0] : null);
            },
          });
        }
      );
    },
    "widgets/Filter/CustomFeaturelayerChooserFromMap": function () {
      define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/Deferred",
        "jimu/dijit/LayerChooserFromMap",
        "jimu/dijit/QueryableLayerChooserFromMap",
      ], function (g, m, k, l, d) {
        return g([d], {
          postMixInProperties: function () {
            this.inherited(arguments);
            this.filter = m.hitch(
              this,
              l.andCombineFilters([
                this.filter,
                m.hitch(this, this._customFilter),
              ])
            );
            this.displayTooltipForTreeNode = !0;
          },
          _customFilter: function (c) {
            var f = new k();
            c.isTable
              ? f.resolve(!1)
              : c.getLayerObject().then(
                  m.hitch(this, function (c) {
                    "esri.layers.ArcGISDynamicMapServiceLayer" ===
                    c.declaredClass
                      ? f.resolve(10 <= c.version)
                      : "esri.layers.ArcGISTiledMapServiceLayer" ===
                        c.declaredClass
                      ? f.resolve(!1)
                      : f.resolve(!0);
                  }),
                  m.hitch(this, function (c) {
                    console.error(c);
                    f.resolve(!1);
                  })
                );
            return f;
          },
        });
      });
    },
    "jimu/dijit/LayerChooserFromMap": function () {
      define(
        "dojo/on dojo/Evented dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/store/Memory dojo/Deferred dojo/store/Observable dijit/tree/ObjectStoreModel dojo/promise/all dojo/_base/lang dojo/_base/html dojo/_base/array jimu/utils jimu/dijit/_Tree jimu/LayerInfos/LayerInfos jimu/dijit/LoadingIndicator".split(
          " "
        ),
        function (g, m, k, l, d, c, f, h, v, w, q, a, r, p, y, n, t, C) {
          var e = k([l, d, c, m], {
            templateString:
              '\x3cdiv style\x3d"width:100%;"\x3e\x3cdiv data-dojo-attach-point\x3d"errorTipSection" class\x3d"error-tip-section"\x3e\x3cspan class\x3d"jimu-icon jimu-icon-error"\x3e\x3c/span\x3e\x3cspan class\x3d"jimu-state-error-text" data-dojo-attach-point\x3d"errTip"\x3e${nls.noLayersTip}\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e',
            _store: null,
            _id: 0,
            _treeClass: "layer-chooser-tree",
            createMapResponse: null,
            multiple: !1,
            onlyShowVisible: !1,
            updateWhenLayerInfosIsShowInMapChanged: !1,
            onlyShowWebMapLayers: !1,
            displayTooltipForTreeNode: !1,
            postMixInProperties: function () {
              this.nls = window.jimuNls.basicLayerChooserFromMap;
            },
            postCreate: function () {
              this.inherited(arguments);
              r.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
              this.multiple = !!this.multiple;
              this.shelter = new C({ hidden: !0 });
              this.shelter.placeAt(this.domNode);
              this.shelter.startup();
              this._createTree();
              this.basicFilter = a.hitch(this, this.basicFilter);
              this.filter = e.andCombineFilters([
                this.basicFilter,
                this.filter,
              ]);
              this.createMapResponse &&
                this.setCreateMapResponse(this.createMapResponse);
            },
            basicFilter: function (b) {
              var e = new h();
              this.onlyShowVisible ? e.resolve(b.isShowInMap()) : e.resolve(!0);
              return e;
            },
            filter: function (b) {
              b = new h();
              b.resolve(!0);
              return b;
            },
            getSelectedItems: function () {
              var b = this.tree.getSelectedItems();
              return p.map(
                b,
                a.hitch(this, function (b) {
                  return this.getHandledItem(b);
                })
              );
            },
            getAllItems: function () {
              var b = this.tree.getAllItems(),
                e = [];
              p.forEach(
                b,
                a.hitch(this, function (b) {
                  "root" !== b.id && ((b = this.getHandledItem(b)), e.push(b));
                })
              );
              return e;
            },
            getHandledItem: function (b) {
              return { name: b.name, layerInfo: b.layerInfo };
            },
            _isLeafItem: function (b) {
              return b.isLeaf;
            },
            setCreateMapResponse: function (b) {
              this.createMapResponse = b;
              t.getInstance(
                this.createMapResponse.map,
                this.createMapResponse.itemInfo
              ).then(
                a.hitch(this, function (b) {
                  this.layerInfosObj = b;
                  this.own(
                    g(
                      this.layerInfosObj,
                      "layerInfosChanged",
                      a.hitch(this, this._onLayerInfosChanged)
                    )
                  );
                  this.updateWhenLayerInfosIsShowInMapChanged &&
                    this.own(
                      g(
                        this.layerInfosObj,
                        "layerInfosIsShowInMapChanged",
                        a.hitch(this, this._onLayerInfosIsShowInMapChanged)
                      )
                    );
                  this._buildTree(this.layerInfosObj);
                })
              );
            },
            _onLayerInfosChanged: function (b, e) {
              this._buildTree(this.layerInfosObj);
              this.emit("update");
            },
            _onLayerInfosIsShowInMapChanged: function (b) {
              this._buildTree(this.layerInfosObj);
              this.emit("update");
            },
            _buildTree: function (b) {
              this._clear();
              r.setStyle(this.errorTipSection, "display", "block");
              var e = [];
              this.onlyShowWebMapLayers
                ? ((e = b.getLayerInfoArrayOfWebmap()),
                  (e = e.concat(b.getTableInfoArrayOfWebmap())))
                : ((e = b.getLayerInfoArray()),
                  (e = e.concat(b.getTableInfoArray())));
              0 !== e.length &&
                (r.setStyle(this.errorTipSection, "display", "none"),
                p.forEach(
                  e,
                  a.hitch(this, function (b) {
                    this._addDirectLayerInfo(b);
                  })
                ));
            },
            _addDirectLayerInfo: function (b) {
              b &&
                b.getLayerObject().then(
                  a.hitch(this, function () {
                    this._addItem("root", b);
                  }),
                  a.hitch(this, function (b) {
                    console.error(b);
                  })
                );
            },
            _clear: function () {
              var b = this._store.query({ parent: "root" });
              p.forEach(
                b,
                a.hitch(this, function (b) {
                  b && "root" !== b.id && this._store.remove(b.id);
                })
              );
            },
            _addItem: function (b, e) {
              var c = null,
                f = e.getLayerType(),
                d = this.filter(e);
              q({ layerType: f, valid: d }).then(
                a.hitch(this, function (f) {
                  if (f.valid) {
                    var d = a.hitch(this, function (a, d) {
                        this._id++;
                        c = {
                          name: e.title || "",
                          parent: b,
                          layerInfo: e,
                          type: f.layerType,
                          layerClass: e.layerObject.declaredClass,
                          id: this._id.toString(),
                          isLeaf: a,
                          hasChildren: d,
                        };
                        this._store.add(c);
                      }),
                      A = e.getSubLayers(),
                      h = 0 === A.length;
                    h
                      ? d(h, !1)
                      : ((A = p.map(
                          A,
                          a.hitch(this, function (b) {
                            return this.filter(b);
                          })
                        )),
                        q(A).then(
                          a.hitch(this, function (b) {
                            (b = p.some(b, function (b) {
                              return b;
                            })) && d(h, b);
                          })
                        ));
                  }
                })
              );
            },
            _getRootItem: function () {
              return {
                id: "root",
                name: "Map Root",
                type: "root",
                isLeaf: !1,
                hasChildren: !0,
              };
            },
            _createTree: function () {
              var b = this._getRootItem(),
                b = new f({
                  data: [b],
                  getChildren: function (b) {
                    return this.query({ parent: b.id });
                  },
                });
              this._store = new v(b);
              b = new w({
                store: this._store,
                query: { id: "root" },
                mayHaveChildren: a.hitch(this, this._mayHaveChildren),
              });
              this.tree = new n({
                multiple: this.multiple,
                model: b,
                showRoot: !1,
                isLeafItem: a.hitch(this, this._isLeafItem),
                style: { width: "100%" },
                onOpen: a.hitch(this, function (b, e) {
                  "root" !== b.id && this._onTreeOpen(b, e);
                }),
                onClick: a.hitch(this, function (b, e, a) {
                  this._onTreeClick(b, e, a);
                  this.emit("tree-click", b, e, a);
                }),
                getIconStyle: a.hitch(this, function (b, e) {
                  var a = null;
                  if (!b || "root" === b.id) return null;
                  var c = {
                      width: "20px",
                      height: "20px",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      backgroundImage: "",
                    },
                    f =
                      window.location.protocol +
                      "//" +
                      window.location.host +
                      require.toUrl("jimu");
                  if ((b = this._getIconImageName(b, e)))
                    (c.backgroundImage = "url(" + f + "/css/images/" + b + ")"),
                      (a = c);
                  return a;
                }),
                getTooltip: a.hitch(this, function (b) {
                  return this.displayTooltipForTreeNode
                    ? b.layerInfo.title
                    : "";
                }),
              });
              r.addClass(this.tree.domNode, this._treeClass);
              this.tree.placeAt(this.shelter.domNode, "before");
            },
            _mayHaveChildren: function (b) {
              return b.hasChildren;
            },
            _getIconImageName: function (b, e) {
              var a = "";
              "ArcGISDynamicMapServiceLayer" === b.type ||
              "ArcGISTiledMapServiceLayer" === b.type
                ? (a = e ? "mapserver_open.png" : "mapserver_close.png")
                : "GroupLayer" === b.type
                ? (a = e ? "group_layer2.png" : "group_layer1.png")
                : "FeatureLayer" === b.type
                ? ((b = y.getTypeByGeometryType(
                    b.layerInfo.layerObject.geometryType
                  )),
                  "point" === b
                    ? (a = "point_layer1.png")
                    : "polyline" === b
                    ? (a = "line_layer1.png")
                    : "polygon" === b && (a = "polygon_layer1.png"))
                : (a =
                    "Table" === b.type
                      ? "table.png"
                      : "ArcGISImageServiceLayer" === b.type ||
                        "ArcGISImageServiceVectorLayer" === b.type
                      ? "image_layer.png"
                      : e
                      ? "mapserver_open.png"
                      : "mapserver_close.png");
              return a;
            },
            _onTreeOpen: function (b, e) {
              if ("root" !== b.id) {
                var c = [];
                e = [];
                c = b.layerInfo.getSubLayers();
                b.checked ||
                  (this.shelter.show(),
                  (e = p.map(
                    c,
                    a.hitch(this, function (b) {
                      return b.getLayerObject();
                    })
                  )),
                  q(e).then(
                    a.hitch(this, function () {
                      this.domNode &&
                        (p.forEach(
                          c,
                          a.hitch(this, function (e) {
                            this._addItem(b.id, e);
                          })
                        ),
                        (b.checked = !0),
                        this.shelter.hide());
                    }),
                    a.hitch(this, function (b) {
                      console.error(b);
                      this.shelter.hide();
                    })
                  ));
              }
            },
            _onTreeClick: function (b, e, a) {},
            destroy: function () {
              this.shelter && (this.shelter.destroy(), (this.shelter = null));
              this.tree && this.tree.destroy();
              this.inherited(arguments);
            },
          });
          e.createFilterByLayerType = function (b) {
            a.isArrayLike(b) || (b = []);
            return function (e) {
              var a = new h();
              if (0 === b.length) a.resolve(!0);
              else {
                var c = [];
                e.traversal(function (b) {
                  c.push(b.getLayerType());
                });
                q(c).then(
                  function (e) {
                    for (var c = 0; c < e.length; c++)
                      for (var f = 0; f < b.length; f++)
                        if (e[c] === b[f]) {
                          a.resolve(!0);
                          return;
                        }
                    a.resolve(!1);
                  },
                  function (b) {
                    console.error(b);
                    a.reject(b);
                  }
                );
              }
              return a;
            };
          };
          e.createFeaturelayerFilter = function (b, a, c, f) {
            var d = ["point", "polyline", "polygon"];
            b && 0 < b.length
              ? ((b = p.filter(b, function (b) {
                  return 0 <= d.indexOf(b);
                })),
                0 === b.length && (b = d))
              : (b = d);
            return function (d) {
              var h = d.getLayerType();
              d = d.getLayerObject();
              return q({ layerType: h, layerObject: d }).then(function (d) {
                var h = d.layerType;
                d = d.layerObject;
                if (
                  "ArcGISDynamicMapServiceLayer" === h ||
                  "ArcGISTiledMapServiceLayer" === h ||
                  "GroupLayer" === h ||
                  "FeatureCollection" === h
                )
                  return !0;
                if ("FeatureLayer" === h) {
                  var h = y.getTypeByGeometryType(d.geometryType),
                    h = 0 <= p.indexOf(b, h),
                    t = e._shouldPassStatisticsCheck(f, d);
                  return d.url
                    ? ((d = y.isFeaturelayerUrlSupportQuery(
                        d.url,
                        d.capabilities
                      )),
                      h && d && t)
                    : a && h;
                }
                return "Table" === h
                  ? ((h = y.isFeaturelayerUrlSupportQuery(
                      d.url,
                      d.capabilities
                    )),
                    (d = e._shouldPassStatisticsCheck(f, d)),
                    c && h && d)
                  : !1;
              });
            };
          };
          e.createImageServiceLayerFilter = function (b, a) {
            return function (c) {
              var d = c.getLayerType();
              c = c.getLayerObject();
              return q({ layerType: d, layerObject: c }).then(function (c) {
                var d = c.layerType,
                  f = c.layerObject;
                return "ArcGISImageServiceLayer" === d ||
                  "ArcGISImageServiceVectorLayer" === d
                  ? b
                    ? y.isImageServiceSupportQuery(c.layerObject.capabilities)
                      ? a
                        ? e._shouldPassStatisticsCheck(a, f)
                        : !0
                      : !1
                    : !0
                  : !1;
              });
            };
          };
          e._shouldPassStatisticsCheck = function (b, e) {
            return b
              ? ((b = !1),
                (b = e.advancedQueryCapabilities
                  ? !!e.advancedQueryCapabilities.supportsStatistics
                  : !!e.supportsStatistics))
              : !0;
          };
          e.createQueryableLayerFilter = function (b) {
            var a = e.createFeaturelayerFilter(
              ["point", "polyline", "polygon"],
              !1,
              !0,
              b
            );
            b = e.createImageServiceLayerFilter(!0, b);
            return e.orCombineFilters([a, b]);
          };
          e.andCombineFilters = function (b) {
            return e._combineFilters(b, !0);
          };
          e.orCombineFilters = function (b) {
            return e._combineFilters(b, !1);
          };
          e._combineFilters = function (b, e) {
            return function (a) {
              var c = new h(),
                d = p.map(b, function (b) {
                  return b(a);
                });
              q(d).then(
                function (b) {
                  var a = !1,
                    a = e
                      ? p.every(b, function (b) {
                          return b;
                        })
                      : p.some(b, function (b) {
                          return b;
                        });
                  c.resolve(a);
                },
                function (b) {
                  console.error(b);
                  c.reject(b);
                }
              );
              return c;
            };
          };
          return e;
        }
      );
    },
    "dijit/tree/ObjectStoreModel": function () {
      define(
        "dojo/_base/array dojo/aspect dojo/_base/declare dojo/Deferred dojo/_base/lang dojo/when ../Destroyable".split(
          " "
        ),
        function (g, m, k, l, d, c, f) {
          return k("dijit.tree.ObjectStoreModel", f, {
            store: null,
            labelAttr: "name",
            labelType: "text",
            root: null,
            query: null,
            constructor: function (c) {
              d.mixin(this, c);
              this.childrenCache = {};
            },
            getRoot: function (f, g) {
              if (this.root) f(this.root);
              else {
                var h = this.store.query(this.query);
                h.then && this.own(h);
                c(
                  h,
                  d.hitch(this, function (c) {
                    if (1 != c.length)
                      throw Error(
                        "dijit.tree.ObjectStoreModel: root query returned " +
                          c.length +
                          " items, but must return exactly one"
                      );
                    this.root = c[0];
                    f(this.root);
                    h.observe &&
                      h.observe(
                        d.hitch(this, function (a) {
                          this.onChange(a);
                        }),
                        !0
                      );
                  }),
                  g
                );
              }
            },
            mayHaveChildren: function () {
              return !0;
            },
            getChildren: function (f, g, l) {
              var h = this.store.getIdentity(f);
              if (this.childrenCache[h]) c(this.childrenCache[h], g, l);
              else {
                var a = (this.childrenCache[h] = this.store.getChildren(f));
                a.then && this.own(a);
                a.observe &&
                  this.own(
                    a.observe(
                      d.hitch(this, function (h, p, g) {
                        this.onChange(h);
                        p != g && c(a, d.hitch(this, "onChildrenChange", f));
                      }),
                      !0
                    )
                  );
                c(a, g, l);
              }
            },
            isItem: function () {
              return !0;
            },
            getIdentity: function (c) {
              return this.store.getIdentity(c);
            },
            getLabel: function (c) {
              return c[this.labelAttr];
            },
            newItem: function (c, d, f, g) {
              return this.store.put(c, { parent: d, before: g });
            },
            pasteItem: function (c, f, k, m, a, r) {
              var h = new l();
              if (f === k && !m && !r) return h.resolve(!0), h;
              f && !m
                ? this.getChildren(
                    f,
                    d.hitch(this, function (a) {
                      a = [].concat(a);
                      var d = g.indexOf(a, c);
                      a.splice(d, 1);
                      this.onChildrenChange(f, a);
                      h.resolve(
                        this.store.put(c, {
                          overwrite: !0,
                          parent: k,
                          oldParent: f,
                          before: r,
                        })
                      );
                    })
                  )
                : h.resolve(
                    this.store.put(c, {
                      overwrite: !0,
                      parent: k,
                      oldParent: f,
                      before: r,
                    })
                  );
              return h;
            },
            onChange: function () {},
            onChildrenChange: function () {},
            onDelete: function () {},
          });
        }
      );
    },
    "jimu/dijit/_Tree": function () {
      define(
        "dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!./templates/_TreeNode.html dojo/_base/lang dojo/_base/html dojo/_base/array dojo/_base/event dojo/query dojo/aspect dojo/on dojo/Evented dijit/registry dijit/Tree jimu/utils".split(
          " "
        ),
        function (g, m, k, l, d, c, f, h, v, w, q, a, r, p, y) {
          var n = g([p._TreeNode, a], {
            templateString: l,
            declaredClass: "jimu._TreeNode",
            isLeaf: !1,
            groupId: "",
            postCreate: function () {
              this.inherited(arguments);
              c.addClass(this.domNode, "jimu-tree-node");
              this.isLeaf = !!this.isLeaf;
              this.groupId
                ? ((this.checkNode = c.toDom(
                    '\x3cinput type\x3d"radio" /\x3e'
                  )),
                  (this.checkNode.name = this.groupId))
                : (this.checkNode = c.toDom(
                    '\x3cinput type\x3d"checkbox" /\x3e'
                  ));
              c.addClass(this.checkNode, "jimu-tree-check-node");
              c.place(this.checkNode, this.contentNode, "first");
              this.own(
                q(this.checkNode, "click", d.hitch(this, this._onClick))
              );
              this.isLeaf
                ? this.groupId
                  ? c.setStyle(this.checkNode, "display", "none")
                  : c.setStyle(this.checkNode, "display", "inline")
                : c.setStyle(this.checkNode, "display", "none");
              this.isLeaf
                ? c.addClass(this.domNode, "jimu-tree-leaf-node")
                : c.addClass(this.domNode, "jimu-tree-not-leaf-node");
            },
            select: function () {
              this.isLeaf &&
                ((this.checkNode.checked = !0),
                c.addClass(this.domNode, "jimu-tree-selected-leaf-node"));
            },
            unselect: function () {
              this.isLeaf &&
                ((this.checkNode.checked = !1),
                c.removeClass(this.domNode, "jimu-tree-selected-leaf-node"));
            },
            toggleSelect: function () {
              this.isLeaf &&
                (this.checkNode.checked ? this.unselect() : this.select());
            },
            _onClick: function (a) {
              (a.target || a.srcElement) === this.checkNode
                ? this.tree._onCheckNodeClick(this, this.checkNode.checked, a)
                : this.tree._onClick(this, a);
            },
            _onChange: function () {
              this.isLeaf &&
                setTimeout(
                  d.hitch(this, function () {
                    this.checkNode.checked
                      ? this.emit("tn-select", this)
                      : this.emit("tn-unselect", this);
                  }),
                  100
                );
            },
            destroy: function () {
              delete this.tree;
              this.inherited(arguments);
            },
          });
          return g([p, a], {
            declaredClass: "jimu._Tree",
            openOnClick: !0,
            multiple: !0,
            uniqueId: "",
            showRoot: !1,
            postMixInProperties: function () {
              this.inherited(arguments);
              this.uniqueId = "tree_" + y.getRandomString();
            },
            postCreate: function () {
              this.inherited(arguments);
              c.addClass(this.domNode, "jimu-tree");
              this.own(
                w.before(this, "onClick", d.hitch(this, this._jimuBeforeClick))
              );
              this.rootLoadingIndicator &&
                c.setStyle(this.rootLoadingIndicator, "display", "none");
              this.dndController.singular = !0;
            },
            removeItem: function (a) {
              this.model.store.remove(a);
            },
            getAllItems: function () {
              var a = this.getAllTreeNodeWidgets();
              return f.map(
                a,
                d.hitch(this, function (a) {
                  var e = a.item;
                  e.selected = a.checkNode.checked;
                  return e;
                })
              );
            },
            getSelectedItems: function () {
              var a = this.getAllTreeNodeWidgets(),
                a = f.filter(
                  a,
                  d.hitch(this, function (a) {
                    return a.checkNode.checked;
                  })
                );
              return f.map(
                a,
                d.hitch(this, function (a) {
                  return a.item;
                })
              );
            },
            getFilteredItems: function (a) {
              var c = this.getAllTreeNodeWidgets(),
                c = f.map(
                  c,
                  d.hitch(this, function (a) {
                    var b = a.item;
                    b.selected = a.checkNode.checked;
                    return b;
                  })
                );
              return f.filter(
                c,
                d.hitch(this, function (e) {
                  return a(e);
                })
              );
            },
            getTreeNodeByItemId: function (a) {
              for (
                var c = this._getAllTreeNodeDoms(), e = 0;
                e < c.length;
                e++
              ) {
                var b = r.byNode(c[e]);
                if (b.item.id.toString() === a.toString()) return b;
              }
              return null;
            },
            selectItem: function (a) {
              (a = this.getTreeNodeByItemId(a)) &&
                a.isLeaf &&
                this.selectNodeWidget(a);
            },
            unselectItem: function (a) {
              (a = this.getTreeNodeByItemId(a)) && a.isLeaf && a.unselect();
            },
            getAllLeafTreeNodeWidgets: function () {
              var a = this.getAllTreeNodeWidgets();
              return f.filter(
                a,
                d.hitch(this, function (a) {
                  return a.isLeaf;
                })
              );
            },
            getAllTreeNodeWidgets: function () {
              var a = this._getAllTreeNodeDoms();
              return f.map(
                a,
                d.hitch(this, function (a) {
                  return r.byNode(a);
                })
              );
            },
            isLeafItem: function (a) {
              return a && a.isLeaf;
            },
            _getAllTreeNodeDoms: function () {
              return v(".dijitTreeNode", this.domNode);
            },
            _createTreeNode: function (a) {
              a.isLeaf = this.isLeafItem(a.item);
              this.multiple || (a.groupId = this.uniqueId);
              return new n(a);
            },
            _onTreeNodeSelect: function (a) {
              this.emit("item-select", { item: a.item, treeNode: a });
            },
            _onTreeNodeUnselect: function (a) {
              this.emit("item-unselect", { item: a.item, treeNode: a });
            },
            selectNodeWidget: function (a) {
              this.multiple || this.unselectAllLeafNodeWidgets();
              a.select();
            },
            _jimuBeforeClick: function (a, d, e) {
              d.isLeaf &&
                (c.hasClass(e.target || e.srcElement, "jimu-tree-check-node") ||
                  (this.multiple
                    ? d.toggleSelect()
                    : this.selectNodeWidget(d)));
              return arguments;
            },
            _onCheckNodeClick: function (a, c, e) {
              !this.multiple && c && this.unselectAllLeafNodeWidgets();
              h.stop(e);
              this.focusNode(a);
              setTimeout(
                d.hitch(this, function () {
                  c ? this.selectNodeWidget(a) : a.unselect();
                  this.onClick(a.item, a, e);
                }),
                0
              );
            },
            unselectAllLeafNodeWidgets: function () {
              var a = this.getAllLeafTreeNodeWidgets();
              f.forEach(
                a,
                d.hitch(this, function (a) {
                  a.unselect();
                })
              );
            },
          });
        }
      );
    },
    "dijit/Tree": function () {
      define(
        "dojo/_base/array dojo/aspect dojo/cookie dojo/_base/declare dojo/Deferred dojo/promise/all dojo/dom dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/errors/create dojo/fx dojo/has dojo/_base/kernel dojo/keys dojo/_base/lang dojo/on dojo/topic dojo/touch dojo/when ./a11yclick ./focus ./registry ./_base/manager ./_Widget ./_TemplatedMixin ./_Container ./_Contained ./_CssStateMixin ./_KeyNavMixin dojo/text!./templates/TreeNode.html dojo/text!./templates/Tree.html ./tree/TreeStoreModel ./tree/ForestStoreModel ./tree/_dndSelector dojo/query!css2".split(
          " "
        ),
        function (
          g,
          m,
          k,
          l,
          d,
          c,
          f,
          h,
          v,
          w,
          q,
          a,
          r,
          p,
          y,
          n,
          t,
          C,
          e,
          b,
          A,
          K,
          D,
          F,
          G,
          I,
          J,
          M,
          H,
          L,
          N,
          O,
          R,
          P,
          Q
        ) {
          function x(a) {
            return n.delegate(a.promise || a, {
              addCallback: function (a) {
                this.then(a);
              },
              addErrback: function (a) {
                this.otherwise(a);
              },
            });
          }
          var E = l("dijit._TreeNode", [G, I, J, M, H], {
            item: null,
            isTreeNode: !0,
            label: "",
            _setLabelAttr: function (a) {
              this.labelNode[
                "html" == this.labelType
                  ? "innerHTML"
                  : "innerText" in this.labelNode
                  ? "innerText"
                  : "textContent"
              ] = a;
              this._set("label", a);
              r("dojo-bidi") && this.applyTextDir(this.labelNode);
            },
            labelType: "text",
            isExpandable: null,
            isExpanded: !1,
            state: "NotLoaded",
            templateString: N,
            baseClass: "dijitTreeNode",
            cssStateNodes: { rowNode: "dijitTreeRow" },
            _setTooltipAttr: {
              node: "rowNode",
              type: "attribute",
              attribute: "title",
            },
            buildRendering: function () {
              this.inherited(arguments);
              this._setExpando();
              this._updateItemClasses(this.item);
              this.isExpandable &&
                this.labelNode.setAttribute("aria-expanded", this.isExpanded);
              this.setSelected(!1);
            },
            _setIndentAttr: function (a) {
              var b = Math.max(a, 0) * this.tree._nodePixelIndent + "px";
              w.set(this.domNode, "backgroundPosition", b + " 0px");
              w.set(
                this.rowNode,
                this.isLeftToRight() ? "paddingLeft" : "paddingRight",
                b
              );
              g.forEach(this.getChildren(), function (b) {
                b.set("indent", a + 1);
              });
              this._set("indent", a);
            },
            markProcessing: function () {
              this.state = "Loading";
              this._setExpando(!0);
            },
            unmarkProcessing: function () {
              this._setExpando(!1);
            },
            _updateItemClasses: function (a) {
              var b = this.tree,
                u = b.model;
              b._v10Compat && a === u.root && (a = null);
              this._applyClassAndStyle(a, "icon", "Icon");
              this._applyClassAndStyle(a, "label", "Label");
              this._applyClassAndStyle(a, "row", "Row");
              this.tree._startPaint(!0);
            },
            _applyClassAndStyle: function (a, b, e) {
              var u = "_" + b + "Class";
              b += "Node";
              var c = this[u];
              this[u] = this.tree["get" + e + "Class"](a, this.isExpanded);
              h.replace(this[b], this[u] || "", c || "");
              w.set(
                this[b],
                this.tree["get" + e + "Style"](a, this.isExpanded) || {}
              );
            },
            _updateLayout: function () {
              var a = this.getParent(),
                a = !a || !a.rowNode || "none" == a.rowNode.style.display;
              h.toggle(this.domNode, "dijitTreeIsRoot", a);
              h.toggle(
                this.domNode,
                "dijitTreeIsLast",
                !a && !this.getNextSibling()
              );
            },
            _setExpando: function (a) {
              var b = [
                "dijitTreeExpandoLoading",
                "dijitTreeExpandoOpened",
                "dijitTreeExpandoClosed",
                "dijitTreeExpandoLeaf",
              ];
              a = a ? 0 : this.isExpandable ? (this.isExpanded ? 1 : 2) : 3;
              h.replace(this.expandoNode, b[a], b);
              this.expandoNodeText.innerHTML = ["*", "-", "+", "*"][a];
            },
            expand: function () {
              if (this._expandDeferred) return x(this._expandDeferred);
              this._collapseDeferred &&
                (this._collapseDeferred.cancel(),
                delete this._collapseDeferred);
              this.isExpanded = !0;
              this.labelNode.setAttribute("aria-expanded", "true");
              (this.tree.showRoot || this !== this.tree.rootNode) &&
                this.containerNode.setAttribute("role", "group");
              h.add(this.contentNode, "dijitTreeContentExpanded");
              this._setExpando();
              this._updateItemClasses(this.item);
              this == this.tree.rootNode &&
                this.tree.showRoot &&
                this.tree.domNode.setAttribute("aria-expanded", "true");
              var b = a.wipeIn({
                  node: this.containerNode,
                  duration: F.defaultDuration,
                }),
                e = (this._expandDeferred = new d(function () {
                  b.stop();
                }));
              m.after(
                b,
                "onEnd",
                function () {
                  e.resolve(!0);
                },
                !0
              );
              b.play();
              return x(e);
            },
            collapse: function () {
              if (this._collapseDeferred) return x(this._collapseDeferred);
              this._expandDeferred &&
                (this._expandDeferred.cancel(), delete this._expandDeferred);
              this.isExpanded = !1;
              this.labelNode.setAttribute("aria-expanded", "false");
              this == this.tree.rootNode &&
                this.tree.showRoot &&
                this.tree.domNode.setAttribute("aria-expanded", "false");
              h.remove(this.contentNode, "dijitTreeContentExpanded");
              this._setExpando();
              this._updateItemClasses(this.item);
              var b = a.wipeOut({
                  node: this.containerNode,
                  duration: F.defaultDuration,
                }),
                e = (this._collapseDeferred = new d(function () {
                  b.stop();
                }));
              m.after(
                b,
                "onEnd",
                function () {
                  e.resolve(!0);
                },
                !0
              );
              b.play();
              return x(e);
            },
            indent: 0,
            setChildItems: function (a) {
              var b = this.tree,
                e = b.model,
                u = [],
                d = b.focusedChild,
                h = this.getChildren();
              g.forEach(
                h,
                function (a) {
                  J.prototype.removeChild.call(this, a);
                },
                this
              );
              this.defer(function () {
                g.forEach(h, function (a) {
                  if (!a._destroyed && !a.getParent()) {
                    var u = function (a) {
                      var c = e.getIdentity(a.item),
                        d = b._itemNodesMap[c];
                      1 == d.length
                        ? delete b._itemNodesMap[c]
                        : ((c = g.indexOf(d, a)), -1 != c && d.splice(c, 1));
                      g.forEach(a.getChildren(), u);
                    };
                    b.dndController.removeTreeNode(a);
                    u(a);
                    if (b.persist) {
                      var c = g
                          .map(a.getTreePath(), function (a) {
                            return b.model.getIdentity(a);
                          })
                          .join("/"),
                        z;
                      for (z in b._openedNodes)
                        z.substr(0, c.length) == c && delete b._openedNodes[z];
                      b._saveExpandedNodes();
                    }
                    b.lastFocusedChild &&
                      !f.isDescendant(b.lastFocusedChild.domNode, b.domNode) &&
                      delete b.lastFocusedChild;
                    d && !f.isDescendant(d.domNode, b.domNode) && b.focus();
                    a.destroyRecursive();
                  }
                });
              });
              this.state = "Loaded";
              a && 0 < a.length
                ? ((this.isExpandable = !0),
                  g.forEach(
                    a,
                    function (a) {
                      var c = e.getIdentity(a),
                        d = b._itemNodesMap[c],
                        f;
                      if (d)
                        for (var z = 0; z < d.length; z++)
                          if (d[z] && !d[z].getParent()) {
                            f = d[z];
                            f.set("indent", this.indent + 1);
                            break;
                          }
                      f ||
                        ((f = this.tree._createTreeNode({
                          item: a,
                          tree: b,
                          isExpandable: e.mayHaveChildren(a),
                          label: b.getLabel(a),
                          labelType: (b.model && b.model.labelType) || "text",
                          tooltip: b.getTooltip(a),
                          ownerDocument: b.ownerDocument,
                          dir: b.dir,
                          lang: b.lang,
                          textDir: b.textDir,
                          indent: this.indent + 1,
                        })),
                        d ? d.push(f) : (b._itemNodesMap[c] = [f]));
                      this.addChild(f);
                      (this.tree.autoExpand || this.tree._state(f)) &&
                        u.push(b._expandNode(f));
                    },
                    this
                  ),
                  g.forEach(this.getChildren(), function (a) {
                    a._updateLayout();
                  }))
                : (this.isExpandable = !1);
              this._setExpando && this._setExpando(!1);
              this._updateItemClasses(this.item);
              a = c(u);
              this.tree._startPaint(a);
              return x(a);
            },
            getTreePath: function () {
              for (var a = this, b = []; a && a !== this.tree.rootNode; )
                b.unshift(a.item), (a = a.getParent());
              b.unshift(this.tree.rootNode.item);
              return b;
            },
            getIdentity: function () {
              return this.tree.model.getIdentity(this.item);
            },
            removeChild: function (a) {
              this.inherited(arguments);
              var b = this.getChildren();
              0 == b.length && ((this.isExpandable = !1), this.collapse());
              g.forEach(b, function (a) {
                a._updateLayout();
              });
            },
            makeExpandable: function () {
              this.isExpandable = !0;
              this._setExpando(!1);
            },
            setSelected: function (a) {
              this.labelNode.setAttribute(
                "aria-selected",
                a ? "true" : "false"
              );
              h.toggle(this.rowNode, "dijitTreeRowSelected", a);
            },
            focus: function () {
              K.focus(this.focusNode);
            },
          });
          r("dojo-bidi") &&
            E.extend({
              _setTextDirAttr: function (a) {
                !a ||
                  (this.textDir == a && this._created) ||
                  (this._set("textDir", a),
                  this.applyTextDir(this.labelNode),
                  g.forEach(
                    this.getChildren(),
                    function (b) {
                      b.set("textDir", a);
                    },
                    this
                  ));
              },
            });
          var B = l("dijit.Tree", [G, L, I, H], {
            baseClass: "dijitTree",
            store: null,
            model: null,
            query: null,
            label: "",
            showRoot: !0,
            childrenAttr: ["children"],
            paths: [],
            path: [],
            selectedItems: null,
            selectedItem: null,
            openOnClick: !1,
            openOnDblClick: !1,
            templateString: O,
            persist: !1,
            autoExpand: !1,
            dndController: Q,
            dndParams:
              "onDndDrop itemCreator onDndCancel checkAcceptance checkItemAcceptance dragThreshold betweenThreshold".split(
                " "
              ),
            onDndDrop: null,
            itemCreator: null,
            onDndCancel: null,
            checkAcceptance: null,
            checkItemAcceptance: null,
            dragThreshold: 5,
            betweenThreshold: 0,
            _nodePixelIndent: 19,
            _publish: function (a, b) {
              C.publish(this.id, n.mixin({ tree: this, event: a }, b || {}));
            },
            postMixInProperties: function () {
              this.tree = this;
              this.autoExpand && (this.persist = !1);
              this._itemNodesMap = {};
              !this.cookieName &&
                this.id &&
                (this.cookieName = this.id + "SaveStateCookie");
              this.expandChildrenDeferred = new d();
              this.pendingCommandsPromise = this.expandChildrenDeferred.promise;
              this.inherited(arguments);
            },
            postCreate: function () {
              this._initState();
              var a = this;
              this.own(
                t(
                  this.containerNode,
                  t.selector(".dijitTreeNode", e.enter),
                  function (b) {
                    a._onNodeMouseEnter(D.byNode(this), b);
                  }
                ),
                t(
                  this.containerNode,
                  t.selector(".dijitTreeNode", e.leave),
                  function (b) {
                    a._onNodeMouseLeave(D.byNode(this), b);
                  }
                ),
                t(
                  this.containerNode,
                  t.selector(".dijitTreeRow", A.press),
                  function (b) {
                    a._onNodePress(D.getEnclosingWidget(this), b);
                  }
                ),
                t(
                  this.containerNode,
                  t.selector(".dijitTreeRow", A),
                  function (b) {
                    a._onClick(D.getEnclosingWidget(this), b);
                  }
                ),
                t(
                  this.containerNode,
                  t.selector(".dijitTreeRow", "dblclick"),
                  function (b) {
                    a._onDblClick(D.getEnclosingWidget(this), b);
                  }
                )
              );
              this.model || this._store2model();
              this.own(
                m.after(
                  this.model,
                  "onChange",
                  n.hitch(this, "_onItemChange"),
                  !0
                ),
                m.after(
                  this.model,
                  "onChildrenChange",
                  n.hitch(this, "_onItemChildrenChange"),
                  !0
                ),
                m.after(
                  this.model,
                  "onDelete",
                  n.hitch(this, "_onItemDelete"),
                  !0
                )
              );
              this.inherited(arguments);
              if (this.dndController) {
                n.isString(this.dndController) &&
                  (this.dndController = n.getObject(this.dndController));
                for (var b = {}, c = 0; c < this.dndParams.length; c++)
                  this[this.dndParams[c]] &&
                    (b[this.dndParams[c]] = this[this.dndParams[c]]);
                this.dndController = new this.dndController(this, b);
              }
              this._load();
              this.onLoadDeferred = x(this.pendingCommandsPromise);
              this.onLoadDeferred.then(n.hitch(this, "onLoad"));
            },
            _store2model: function () {
              this._v10Compat = !0;
              p.deprecated(
                "Tree: from version 2.0, should specify a model object rather than a store/query"
              );
              var a = {
                id: this.id + "_ForestStoreModel",
                store: this.store,
                query: this.query,
                childrenAttrs: this.childrenAttr,
              };
              this.params.mayHaveChildren &&
                (a.mayHaveChildren = n.hitch(this, "mayHaveChildren"));
              this.params.getItemChildren &&
                (a.getChildren = n.hitch(this, function (a, b, e) {
                  this.getItemChildren(
                    this._v10Compat && a === this.model.root ? null : a,
                    b,
                    e
                  );
                }));
              this.model = new P(a);
              this.showRoot = !!this.label;
            },
            onLoad: function () {},
            _load: function () {
              this.model.getRoot(
                n.hitch(this, function (a) {
                  var b = (this.rootNode = this.tree._createTreeNode({
                    item: a,
                    tree: this,
                    isExpandable: !0,
                    label: this.label || this.getLabel(a),
                    labelType: this.model.labelType || "text",
                    textDir: this.textDir,
                    indent: this.showRoot ? 0 : -1,
                  }));
                  this.showRoot
                    ? (this.domNode.setAttribute(
                        "aria-multiselectable",
                        !this.dndController.singular
                      ),
                      (this.rootLoadingIndicator.style.display = "none"))
                    : ((b.rowNode.style.display = "none"),
                      this.domNode.setAttribute("role", "presentation"),
                      this.domNode.removeAttribute("aria-expanded"),
                      this.domNode.removeAttribute("aria-multiselectable"),
                      this["aria-label"]
                        ? (b.containerNode.setAttribute(
                            "aria-label",
                            this["aria-label"]
                          ),
                          this.domNode.removeAttribute("aria-label"))
                        : this["aria-labelledby"] &&
                          (b.containerNode.setAttribute(
                            "aria-labelledby",
                            this["aria-labelledby"]
                          ),
                          this.domNode.removeAttribute("aria-labelledby")),
                      b.labelNode.setAttribute("role", "presentation"),
                      b.labelNode.removeAttribute("aria-selected"),
                      b.containerNode.setAttribute("role", "tree"),
                      b.containerNode.setAttribute("aria-expanded", "true"),
                      b.containerNode.setAttribute(
                        "aria-multiselectable",
                        !this.dndController.singular
                      ));
                  this.containerNode.appendChild(b.domNode);
                  a = this.model.getIdentity(a);
                  this._itemNodesMap[a]
                    ? this._itemNodesMap[a].push(b)
                    : (this._itemNodesMap[a] = [b]);
                  b._updateLayout();
                  this._expandNode(b).then(
                    n.hitch(this, function () {
                      this._destroyed ||
                        ((this.rootLoadingIndicator.style.display = "none"),
                        this.expandChildrenDeferred.resolve(!0));
                    })
                  );
                }),
                n.hitch(this, function (a) {
                  console.error(this, ": error loading root: ", a);
                })
              );
            },
            getNodesByItem: function (a) {
              if (!a) return [];
              a = n.isString(a) ? a : this.model.getIdentity(a);
              return [].concat(this._itemNodesMap[a]);
            },
            _setSelectedItemAttr: function (a) {
              this.set("selectedItems", [a]);
            },
            _setSelectedItemsAttr: function (a) {
              var b = this;
              return (this.pendingCommandsPromise =
                this.pendingCommandsPromise.always(
                  n.hitch(this, function () {
                    var e = g.map(a, function (a) {
                        return !a || n.isString(a) ? a : b.model.getIdentity(a);
                      }),
                      c = [];
                    g.forEach(e, function (a) {
                      c = c.concat(b._itemNodesMap[a] || []);
                    });
                    this.set("selectedNodes", c);
                  })
                ));
            },
            _setPathAttr: function (a) {
              return a.length
                ? x(
                    this.set("paths", [a]).then(function (a) {
                      return a[0];
                    })
                  )
                : x(
                    this.set("paths", []).then(function (a) {
                      return a[0];
                    })
                  );
            },
            _setPathsAttr: function (a) {
              function b(a, c) {
                var d = a.shift(),
                  u = g.filter(c, function (a) {
                    return a.getIdentity() == d;
                  })[0];
                if (u)
                  return a.length
                    ? e._expandNode(u).then(function () {
                        return b(a, u.getChildren());
                      })
                    : u;
                throw new B.PathError("Could not expand path at " + d);
              }
              var e = this;
              return x(
                (this.pendingCommandsPromise = this.pendingCommandsPromise
                  .always(function () {
                    return c(
                      g.map(a, function (a) {
                        a = g.map(a, function (a) {
                          return a && n.isObject(a)
                            ? e.model.getIdentity(a)
                            : a;
                        });
                        if (a.length) return b(a, [e.rootNode]);
                        throw new B.PathError("Empty path");
                      })
                    );
                  })
                  .then(function (a) {
                    e.set("selectedNodes", a);
                    return e.paths;
                  }))
              );
            },
            _setSelectedNodeAttr: function (a) {
              this.set("selectedNodes", [a]);
            },
            _setSelectedNodesAttr: function (a) {
              this.dndController.setSelection(a);
            },
            expandAll: function () {
              function a(e) {
                return b._expandNode(e).then(function () {
                  var b = g.filter(e.getChildren() || [], function (a) {
                    return a.isExpandable;
                  });
                  return c(g.map(b, a));
                });
              }
              var b = this;
              return x(a(this.rootNode));
            },
            collapseAll: function () {
              function a(e) {
                var d = g.filter(e.getChildren() || [], function (a) {
                    return a.isExpandable;
                  }),
                  d = c(g.map(d, a));
                return !e.isExpanded || (e == b.rootNode && !b.showRoot)
                  ? d
                  : d.then(function () {
                      return b._collapseNode(e);
                    });
              }
              var b = this;
              return x(a(this.rootNode));
            },
            mayHaveChildren: function () {},
            getItemChildren: function () {},
            getLabel: function (a) {
              return this.model.getLabel(a);
            },
            getIconClass: function (a, b) {
              return !a || this.model.mayHaveChildren(a)
                ? b
                  ? "dijitFolderOpened"
                  : "dijitFolderClosed"
                : "dijitLeaf";
            },
            getLabelClass: function () {},
            getRowClass: function () {},
            getIconStyle: function () {},
            getLabelStyle: function () {},
            getRowStyle: function () {},
            getTooltip: function () {
              return "";
            },
            _onDownArrow: function (a, b) {
              (a = this._getNext(b)) && a.isTreeNode && this.focusNode(a);
            },
            _onUpArrow: function (a, b) {
              if ((a = b.getPreviousSibling()))
                for (b = a; b.isExpandable && b.isExpanded && b.hasChildren(); )
                  (b = b.getChildren()), (b = b[b.length - 1]);
              else if (
                ((a = b.getParent()), this.showRoot || a !== this.rootNode)
              )
                b = a;
              b && b.isTreeNode && this.focusNode(b);
            },
            _onRightArrow: function (a, b) {
              b.isExpandable && !b.isExpanded
                ? this._expandNode(b)
                : b.hasChildren() &&
                  (b = b.getChildren()[0]) &&
                  b.isTreeNode &&
                  this.focusNode(b);
            },
            _onLeftArrow: function (a, b) {
              b.isExpandable && b.isExpanded
                ? this._collapseNode(b)
                : (a = b.getParent()) &&
                  a.isTreeNode &&
                  (this.showRoot || a !== this.rootNode) &&
                  this.focusNode(a);
            },
            focusLastChild: function () {
              var a = this._getLast();
              a && a.isTreeNode && this.focusNode(a);
            },
            _getFirst: function () {
              return this.showRoot
                ? this.rootNode
                : this.rootNode.getChildren()[0];
            },
            _getLast: function () {
              for (var a = this.rootNode; a.isExpanded; ) {
                var b = a.getChildren();
                if (!b.length) break;
                a = b[b.length - 1];
              }
              return a;
            },
            _getNext: function (a) {
              if (a.isExpandable && a.isExpanded && a.hasChildren())
                return a.getChildren()[0];
              for (; a && a.isTreeNode; ) {
                var b = a.getNextSibling();
                if (b) return b;
                a = a.getParent();
              }
              return null;
            },
            childSelector: ".dijitTreeRow",
            isExpandoNode: function (a, b) {
              return (
                f.isDescendant(a, b.expandoNode) ||
                f.isDescendant(a, b.expandoNodeText)
              );
            },
            _onNodePress: function (a, b) {
              this.focusNode(a);
            },
            __click: function (a, b, e, c) {
              var d = this.isExpandoNode(b.target, a);
              a.isExpandable && (e || d)
                ? this._onExpandoClick({ node: a })
                : (this._publish("execute", { item: a.item, node: a, evt: b }),
                  this[c](a.item, a, b),
                  this.focusNode(a));
              b.stopPropagation();
              b.preventDefault();
            },
            _onClick: function (a, b) {
              this.__click(a, b, this.openOnClick, "onClick");
            },
            _onDblClick: function (a, b) {
              this.__click(a, b, this.openOnDblClick, "onDblClick");
            },
            _onExpandoClick: function (a) {
              a = a.node;
              this.focusNode(a);
              a.isExpanded ? this._collapseNode(a) : this._expandNode(a);
            },
            onClick: function () {},
            onDblClick: function () {},
            onOpen: function () {},
            onClose: function () {},
            _getNextNode: function (a) {
              p.deprecated(
                this.declaredClass +
                  "::_getNextNode(node) is deprecated. Use _getNext(node) instead.",
                "",
                "2.0"
              );
              return this._getNext(a);
            },
            _getRootOrFirstNode: function () {
              p.deprecated(
                this.declaredClass +
                  "::_getRootOrFirstNode() is deprecated. Use _getFirst() instead.",
                "",
                "2.0"
              );
              return this._getFirst();
            },
            _collapseNode: function (a) {
              a._expandNodeDeferred && delete a._expandNodeDeferred;
              if ("Loading" != a.state && a.isExpanded) {
                var b = a.collapse();
                this.onClose(a.item, a);
                this._state(a, !1);
                this._startPaint(b);
                return b;
              }
            },
            _expandNode: function (a) {
              if (a._expandNodeDeferred) return a._expandNodeDeferred;
              var b = this.model,
                e = a.item,
                c = this;
              a._loadDeferred ||
                (a.markProcessing(),
                (a._loadDeferred = new d()),
                b.getChildren(
                  e,
                  function (b) {
                    a.unmarkProcessing();
                    a.setChildItems(b).then(function () {
                      a._loadDeferred.resolve(b);
                    });
                  },
                  function (b) {
                    console.error(
                      c,
                      ": error loading " + a.label + " children: ",
                      b
                    );
                    a._loadDeferred.reject(b);
                  }
                ));
              b = a._loadDeferred.then(
                n.hitch(this, function () {
                  var b = a.expand();
                  this.onOpen(a.item, a);
                  this._state(a, !0);
                  return b;
                })
              );
              this._startPaint(b);
              return b;
            },
            focusNode: function (a) {
              var b = this.domNode.scrollLeft;
              this.focusChild(a);
              this.domNode.scrollLeft = b;
            },
            _onNodeMouseEnter: function () {},
            _onNodeMouseLeave: function () {},
            _onItemChange: function (a) {
              var b = this.model.getIdentity(a);
              if ((b = this._itemNodesMap[b])) {
                var e = this.getLabel(a),
                  c = this.getTooltip(a);
                g.forEach(b, function (b) {
                  b.set({ item: a, label: e, tooltip: c });
                  b._updateItemClasses(a);
                });
              }
            },
            _onItemChildrenChange: function (a, b) {
              a = this.model.getIdentity(a);
              (a = this._itemNodesMap[a]) &&
                g.forEach(a, function (a) {
                  a.setChildItems(b);
                });
            },
            _onItemDelete: function (a) {
              a = this.model.getIdentity(a);
              var b = this._itemNodesMap[a];
              b &&
                (g.forEach(
                  b,
                  function (a) {
                    this.dndController.removeTreeNode(a);
                    var b = a.getParent();
                    b && b.removeChild(a);
                    this.lastFocusedChild &&
                      !f.isDescendant(
                        this.lastFocusedChild.domNode,
                        this.domNode
                      ) &&
                      delete this.lastFocusedChild;
                    this.focusedChild &&
                      !f.isDescendant(
                        this.focusedChild.domNode,
                        this.domNode
                      ) &&
                      this.focus();
                    a.destroyRecursive();
                  },
                  this
                ),
                delete this._itemNodesMap[a]);
            },
            _initState: function () {
              this._openedNodes = {};
              if (this.persist && this.cookieName) {
                var a = k(this.cookieName);
                a &&
                  g.forEach(
                    a.split(","),
                    function (a) {
                      this._openedNodes[a] = !0;
                    },
                    this
                  );
              }
            },
            _state: function (a, b) {
              if (!this.persist) return !1;
              var e = g
                .map(
                  a.getTreePath(),
                  function (a) {
                    return this.model.getIdentity(a);
                  },
                  this
                )
                .join("/");
              if (1 === arguments.length) return this._openedNodes[e];
              b ? (this._openedNodes[e] = !0) : delete this._openedNodes[e];
              this._saveExpandedNodes();
            },
            _saveExpandedNodes: function () {
              if (this.persist && this.cookieName) {
                var a = [],
                  b;
                for (b in this._openedNodes) a.push(b);
                k(this.cookieName, a.join(","), { expires: 365 });
              }
            },
            destroy: function () {
              this._curSearch &&
                (this._curSearch.timer.remove(), delete this._curSearch);
              this.rootNode && this.rootNode.destroyRecursive();
              this.dndController &&
                !n.isString(this.dndController) &&
                this.dndController.destroy();
              this.rootNode = null;
              this.inherited(arguments);
            },
            destroyRecursive: function () {
              this.destroy();
            },
            resize: function (a) {
              a && v.setMarginBox(this.domNode, a);
              this._nodePixelIndent =
                v.position(this.tree.indentDetector).w || this._nodePixelIndent;
              this.expandChildrenDeferred.then(
                n.hitch(this, function () {
                  this.rootNode.set("indent", this.showRoot ? 0 : -1);
                  this._adjustWidths();
                })
              );
            },
            _outstandingPaintOperations: 0,
            _startPaint: function (a) {
              this._outstandingPaintOperations++;
              this._adjustWidthsTimer &&
                (this._adjustWidthsTimer.remove(),
                delete this._adjustWidthsTimer);
              var e = n.hitch(this, function () {
                this._outstandingPaintOperations--;
                0 >= this._outstandingPaintOperations &&
                  !this._adjustWidthsTimer &&
                  this._started &&
                  (this._adjustWidthsTimer = this.defer("_adjustWidths"));
              });
              b(a, e, e);
            },
            _adjustWidths: function () {
              this._adjustWidthsTimer &&
                (this._adjustWidthsTimer.remove(),
                delete this._adjustWidthsTimer);
              this.containerNode.style.width = "auto";
              this.containerNode.style.width =
                this.domNode.scrollWidth > this.domNode.offsetWidth
                  ? "auto"
                  : "100%";
            },
            _createTreeNode: function (a) {
              return new E(a);
            },
            focus: function () {
              this.lastFocusedChild
                ? this.focusNode(this.lastFocusedChild)
                : this.focusFirstChild();
            },
          });
          r("dojo-bidi") &&
            B.extend({
              _setTextDirAttr: function (a) {
                a &&
                  this.textDir != a &&
                  (this._set("textDir", a), this.rootNode.set("textDir", a));
              },
            });
          B.PathError = q("TreePathError");
          B._TreeNode = E;
          return B;
        }
      );
    },
    "dijit/tree/TreeStoreModel": function () {
      define([
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/_base/declare",
        "dojo/_base/lang",
      ], function (g, m, k, l) {
        return k("dijit.tree.TreeStoreModel", null, {
          store: null,
          childrenAttrs: ["children"],
          newItemIdAttr: "id",
          labelAttr: "",
          root: null,
          query: null,
          deferItemLoadingUntilExpand: !1,
          constructor: function (d) {
            l.mixin(this, d);
            this.connects = [];
            d = this.store;
            if (!d.getFeatures()["dojo.data.api.Identity"])
              throw Error(
                "dijit.tree.TreeStoreModel: store must support dojo.data.Identity"
              );
            d.getFeatures()["dojo.data.api.Notification"] &&
              (this.connects = this.connects.concat([
                m.after(d, "onNew", l.hitch(this, "onNewItem"), !0),
                m.after(d, "onDelete", l.hitch(this, "onDeleteItem"), !0),
                m.after(d, "onSet", l.hitch(this, "onSetItem"), !0),
              ]));
          },
          destroy: function () {
            for (var d; (d = this.connects.pop()); ) d.remove();
          },
          getRoot: function (d, c) {
            this.root
              ? d(this.root)
              : this.store.fetch({
                  query: this.query,
                  onComplete: l.hitch(this, function (c) {
                    if (1 != c.length)
                      throw Error(
                        "dijit.tree.TreeStoreModel: root query returned " +
                          c.length +
                          " items, but must return exactly one"
                      );
                    this.root = c[0];
                    d(this.root);
                  }),
                  onError: c,
                });
          },
          mayHaveChildren: function (d) {
            return g.some(
              this.childrenAttrs,
              function (c) {
                return this.store.hasAttribute(d, c);
              },
              this
            );
          },
          getChildren: function (d, c, f) {
            var h = this.store;
            if (h.isItemLoaded(d)) {
              for (var k = [], m = 0; m < this.childrenAttrs.length; m++)
                var q = h.getValues(d, this.childrenAttrs[m]), k = k.concat(q);
              var a = 0;
              this.deferItemLoadingUntilExpand ||
                g.forEach(k, function (c) {
                  h.isItemLoaded(c) || a++;
                });
              0 == a
                ? c(k)
                : g.forEach(k, function (d, g) {
                    h.isItemLoaded(d) ||
                      h.loadItem({
                        item: d,
                        onItem: function (d) {
                          k[g] = d;
                          0 == --a && c(k);
                        },
                        onError: f,
                      });
                  });
            } else {
              var r = l.hitch(this, arguments.callee);
              h.loadItem({
                item: d,
                onItem: function (a) {
                  r(a, c, f);
                },
                onError: f,
              });
            }
          },
          isItem: function (d) {
            return this.store.isItem(d);
          },
          fetchItemByIdentity: function (d) {
            this.store.fetchItemByIdentity(d);
          },
          getIdentity: function (d) {
            return this.store.getIdentity(d);
          },
          getLabel: function (d) {
            return this.labelAttr
              ? this.store.getValue(d, this.labelAttr)
              : this.store.getLabel(d);
          },
          newItem: function (d, c, f) {
            var h = { parent: c, attribute: this.childrenAttrs[0] },
              g;
            this.newItemIdAttr && d[this.newItemIdAttr]
              ? this.fetchItemByIdentity({
                  identity: d[this.newItemIdAttr],
                  scope: this,
                  onItem: function (l) {
                    l
                      ? this.pasteItem(l, null, c, !0, f)
                      : (g = this.store.newItem(d, h)) &&
                        void 0 != f &&
                        this.pasteItem(g, c, c, !1, f);
                  },
                })
              : (g = this.store.newItem(d, h)) &&
                void 0 != f &&
                this.pasteItem(g, c, c, !1, f);
          },
          pasteItem: function (d, c, f, h, l) {
            var k = this.store,
              m = this.childrenAttrs[0];
            c &&
              g.forEach(this.childrenAttrs, function (a) {
                if (k.containsValue(c, a, d)) {
                  if (!h) {
                    var f = g.filter(k.getValues(c, a), function (a) {
                      return a != d;
                    });
                    k.setValues(c, a, f);
                  }
                  m = a;
                }
              });
            if (f)
              if ("number" == typeof l) {
                var a = k.getValues(f, m).slice();
                a.splice(l, 0, d);
                k.setValues(f, m, a);
              } else k.setValues(f, m, k.getValues(f, m).concat(d));
          },
          onChange: function () {},
          onChildrenChange: function () {},
          onDelete: function () {},
          onNewItem: function (d, c) {
            c &&
              this.getChildren(
                c.item,
                l.hitch(this, function (d) {
                  this.onChildrenChange(c.item, d);
                })
              );
          },
          onDeleteItem: function (d) {
            this.onDelete(d);
          },
          onSetItem: function (d, c) {
            if (-1 != g.indexOf(this.childrenAttrs, c))
              this.getChildren(
                d,
                l.hitch(this, function (c) {
                  this.onChildrenChange(d, c);
                })
              );
            else this.onChange(d);
          },
        });
      });
    },
    "dijit/tree/ForestStoreModel": function () {
      define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dojo/_base/lang",
        "./TreeStoreModel",
      ], function (g, m, k, l, d) {
        return m("dijit.tree.ForestStoreModel", d, {
          rootId: "$root$",
          rootLabel: "ROOT",
          query: null,
          constructor: function (c) {
            this.root = {
              store: this,
              root: !0,
              id: c.rootId,
              label: c.rootLabel,
              children: c.rootChildren,
            };
          },
          mayHaveChildren: function (c) {
            return c === this.root || this.inherited(arguments);
          },
          getChildren: function (c, d, h) {
            c === this.root
              ? this.root.children
                ? d(this.root.children)
                : this.store.fetch({
                    query: this.query,
                    onComplete: l.hitch(this, function (c) {
                      this.root.children = c;
                      d(c);
                    }),
                    onError: h,
                  })
              : this.inherited(arguments);
          },
          isItem: function (c) {
            return c === this.root ? !0 : this.inherited(arguments);
          },
          fetchItemByIdentity: function (c) {
            if (c.identity == this.root.id) {
              var d = c.scope || k.global;
              c.onItem && c.onItem.call(d, this.root);
            } else this.inherited(arguments);
          },
          getIdentity: function (c) {
            return c === this.root ? this.root.id : this.inherited(arguments);
          },
          getLabel: function (c) {
            return c === this.root
              ? this.root.label
              : this.inherited(arguments);
          },
          newItem: function (c, d, h) {
            return d === this.root
              ? (this.onNewRootItem(c), this.store.newItem(c))
              : this.inherited(arguments);
          },
          onNewRootItem: function () {},
          pasteItem: function (c, d, h, g, k) {
            if (d === this.root && !g) this.onLeaveRoot(c);
            this.inherited(arguments, [
              c,
              d === this.root ? null : d,
              h === this.root ? null : h,
              g,
              k,
            ]);
            if (h === this.root) this.onAddToRoot(c);
          },
          onAddToRoot: function (c) {
            console.log(this, ": item ", c, " added to root");
          },
          onLeaveRoot: function (c) {
            console.log(this, ": item ", c, " removed from root");
          },
          _requeryTop: function () {
            var c = this.root.children || [];
            this.store.fetch({
              query: this.query,
              onComplete: l.hitch(this, function (d) {
                this.root.children = d;
                if (
                  c.length != d.length ||
                  g.some(c, function (c, f) {
                    return d[f] != c;
                  })
                )
                  this.onChildrenChange(this.root, d);
              }),
            });
          },
          onNewItem: function (c, d) {
            this._requeryTop();
            this.inherited(arguments);
          },
          onDeleteItem: function (c) {
            -1 != g.indexOf(this.root.children, c) && this._requeryTop();
            this.inherited(arguments);
          },
          onSetItem: function (c, d, h, g) {
            this._requeryTop();
            this.inherited(arguments);
          },
        });
      });
    },
    "dijit/tree/_dndSelector": function () {
      define(
        "dojo/_base/array dojo/_base/declare dojo/_base/kernel dojo/_base/lang dojo/dnd/common dojo/dom dojo/mouse dojo/on dojo/touch ../a11yclick ./_dndContainer".split(
          " "
        ),
        function (g, m, k, l, d, c, f, h, v, w, q) {
          return m("dijit.tree._dndSelector", q, {
            constructor: function () {
              this.selection = {};
              this.anchor = null;
              this.events.push(
                h(this.tree.domNode, v.press, l.hitch(this, "onMouseDown")),
                h(this.tree.domNode, v.release, l.hitch(this, "onMouseUp")),
                h(this.tree.domNode, v.move, l.hitch(this, "onMouseMove")),
                h(this.tree.domNode, w.press, l.hitch(this, "onClickPress")),
                h(this.tree.domNode, w.release, l.hitch(this, "onClickRelease"))
              );
            },
            singular: !1,
            getSelectedTreeNodes: function () {
              var a = [],
                c = this.selection,
                d;
              for (d in c) a.push(c[d]);
              return a;
            },
            selectNone: function () {
              this.setSelection([]);
              return this;
            },
            destroy: function () {
              this.inherited(arguments);
              this.selection = this.anchor = null;
            },
            addTreeNode: function (a, c) {
              this.setSelection(this.getSelectedTreeNodes().concat([a]));
              c && (this.anchor = a);
              return a;
            },
            removeTreeNode: function (a) {
              var d = g.filter(this.getSelectedTreeNodes(), function (d) {
                return !c.isDescendant(d.domNode, a.domNode);
              });
              this.setSelection(d);
              return a;
            },
            isTreeNodeSelected: function (a) {
              return a.id && !!this.selection[a.id];
            },
            setSelection: function (a) {
              var c = this.getSelectedTreeNodes();
              g.forEach(
                this._setDifference(c, a),
                l.hitch(this, function (a) {
                  a.setSelected(!1);
                  this.anchor == a && delete this.anchor;
                  delete this.selection[a.id];
                })
              );
              g.forEach(
                this._setDifference(a, c),
                l.hitch(this, function (a) {
                  a.setSelected(!0);
                  this.selection[a.id] = a;
                })
              );
              this._updateSelectionProperties();
            },
            _setDifference: function (a, c) {
              g.forEach(c, function (a) {
                a.__exclude__ = !0;
              });
              a = g.filter(a, function (a) {
                return !a.__exclude__;
              });
              g.forEach(c, function (a) {
                delete a.__exclude__;
              });
              return a;
            },
            _updateSelectionProperties: function () {
              var a = this.getSelectedTreeNodes(),
                c = [],
                d = [];
              g.forEach(
                a,
                function (a) {
                  var f = a.getTreePath();
                  d.push(a);
                  c.push(f);
                },
                this
              );
              a = g.map(d, function (a) {
                return a.item;
              });
              this.tree._set("paths", c);
              this.tree._set("path", c[0] || []);
              this.tree._set("selectedNodes", d);
              this.tree._set("selectedNode", d[0] || null);
              this.tree._set("selectedItems", a);
              this.tree._set("selectedItem", a[0] || null);
            },
            onClickPress: function (a) {
              if (
                !(
                  this.current &&
                  this.current.isExpandable &&
                  this.tree.isExpandoNode(a.target, this.current)
                )
              ) {
                "mousedown" == a.type && f.isLeft(a) && a.preventDefault();
                var c =
                  "keydown" == a.type ? this.tree.focusedChild : this.current;
                if (c) {
                  var h = d.getCopyKeyState(a),
                    g = c.id;
                  this.singular || a.shiftKey || !this.selection[g]
                    ? ((this._doDeselect = !1),
                      this.userSelect(c, h, a.shiftKey))
                    : (this._doDeselect = !0);
                }
              }
            },
            onClickRelease: function (a) {
              this._doDeselect &&
                ((this._doDeselect = !1),
                this.userSelect(
                  "keyup" == a.type ? this.tree.focusedChild : this.current,
                  d.getCopyKeyState(a),
                  a.shiftKey
                ));
            },
            onMouseMove: function () {
              this._doDeselect = !1;
            },
            onMouseDown: function () {},
            onMouseUp: function () {},
            _compareNodes: function (a, c) {
              if (a === c) return 0;
              if ("sourceIndex" in document.documentElement)
                return a.sourceIndex - c.sourceIndex;
              if ("compareDocumentPosition" in document.documentElement)
                return a.compareDocumentPosition(c) & 2 ? 1 : -1;
              if (document.createRange) {
                var d = doc.createRange();
                d.setStartBefore(a);
                a = doc.createRange();
                a.setStartBefore(c);
                return d.compareBoundaryPoints(d.END_TO_END, a);
              }
              throw Error(
                "dijit.tree._compareNodes don't know how to compare two different nodes in this browser"
              );
            },
            userSelect: function (a, c, d) {
              if (this.singular)
                this.anchor == a && c
                  ? this.selectNone()
                  : (this.setSelection([a]), (this.anchor = a));
              else if (d && this.anchor) {
                c = this._compareNodes(this.anchor.rowNode, a.rowNode);
                d = this.anchor;
                0 > c ? (c = d) : ((c = a), (a = d));
                for (d = []; c != a; ) d.push(c), (c = this.tree._getNext(c));
                d.push(a);
                this.setSelection(d);
              } else
                this.selection[a.id] && c
                  ? this.removeTreeNode(a)
                  : c
                  ? this.addTreeNode(a, !0)
                  : (this.setSelection([a]), (this.anchor = a));
            },
            getItem: function (a) {
              return { data: this.selection[a], type: ["treeNode"] };
            },
            forInSelectedItems: function (a, c) {
              c = c || k.global;
              for (var d in this.selection) a.call(c, this.getItem(d), d, this);
            },
          });
        }
      );
    },
    "dijit/tree/_dndContainer": function () {
      define(
        "dojo/aspect dojo/_base/declare dojo/dom-class dojo/_base/lang dojo/on dojo/touch".split(
          " "
        ),
        function (g, m, k, l, d, c) {
          return m("dijit.tree._dndContainer", null, {
            constructor: function (f, h) {
              this.tree = f;
              this.node = f.domNode;
              l.mixin(this, h);
              this.containerState = "";
              k.add(this.node, "dojoDndContainer");
              this.events = [
                d(this.node, c.enter, l.hitch(this, "onOverEvent")),
                d(this.node, c.leave, l.hitch(this, "onOutEvent")),
                g.after(
                  this.tree,
                  "_onNodeMouseEnter",
                  l.hitch(this, "onMouseOver"),
                  !0
                ),
                g.after(
                  this.tree,
                  "_onNodeMouseLeave",
                  l.hitch(this, "onMouseOut"),
                  !0
                ),
                d(this.node, "dragstart, selectstart", function (c) {
                  c.preventDefault();
                }),
              ];
            },
            destroy: function () {
              for (var c; (c = this.events.pop()); ) c.remove();
              this.node = this.parent = null;
            },
            onMouseOver: function (c) {
              this.current = c;
            },
            onMouseOut: function () {
              this.current = null;
            },
            _changeState: function (c, d) {
              var f = "dojoDnd" + c;
              c = c.toLowerCase() + "State";
              k.replace(this.node, f + d, f + this[c]);
              this[c] = d;
            },
            _addItemClass: function (c, d) {
              k.add(c, "dojoDndItem" + d);
            },
            _removeItemClass: function (c, d) {
              k.remove(c, "dojoDndItem" + d);
            },
            onOverEvent: function () {
              this._changeState("Container", "Over");
            },
            onOutEvent: function () {
              this._changeState("Container", "");
            },
          });
        }
      );
    },
    "jimu/dijit/QueryableLayerChooserFromMap": function () {
      define([
        "dojo/_base/lang",
        "dojo/_base/html",
        "dojo/_base/declare",
        "./LayerChooserFromMap",
      ], function (g, m, k, l) {
        return k([l], {
          baseClass: "jimu-queryable-layer-chooser-from-map",
          declaredClass: "jimu.dijit.QueryableLayerChooserFromMap",
          showImageLayer: !0,
          mustSupportStatistics: !1,
          ignoreVirtualLayer: !1,
          postMixInProperties: function () {
            this.inherited(arguments);
            this.filter = this.showImageLayer
              ? l.createQueryableLayerFilter(this.mustSupportStatistics)
              : l.createFeaturelayerFilter(
                  ["point", "polyline", "polygon"],
                  !1,
                  !0,
                  this.mustSupportStatistics
                );
            this.ignoreVirtualLayer &&
              (this.filter = l.andCombineFilters([
                this.filter,
                g.hitch(this, this._ignoreVirtualLayerFilter),
              ]));
          },
          _ignoreVirtualLayerFilter: function (d) {
            return d.getLayerType().then(function (c) {
              return !(
                "ArcGISDynamicMapServiceLayer" === c ||
                "ArcGISTiledMapServiceLayer" === c ||
                "GroupLayer" === c
              );
            });
          },
          postCreate: function () {
            this.inherited(arguments);
            m.addClass(this.domNode, "jimu-basic-layer-chooser-from-map");
          },
          getHandledItem: function (d) {
            var c = this.inherited(arguments),
              f = d && d.layerInfo,
              f = f && f.layerObject;
            c.url = (f && f.url) || "";
            return c;
          },
        });
      });
    },
    "jimu/dijit/ToggleButton": function () {
      define(
        "dojo/_base/declare dijit/_WidgetBase dojo/_base/lang dojo/_base/html dojo/on dojo/Evented".split(
          " "
        ),
        function (g, m, k, l, d, c) {
          return g([m, c], {
            baseClass: "jimu-toggle-button",
            declaredClass: "jimu.dijit.ToggleButton",
            checked: !1,
            postCreate: function () {
              this.innerNode = l.create(
                "div",
                { class: "inner" },
                this.domNode
              );
              this.checked && l.addClass(this.domNode, "checked");
              this.own(
                d(
                  this.domNode,
                  "click",
                  k.hitch(this, function () {
                    this.toggle();
                  })
                )
              );
            },
            check: function () {
              this.checked = !0;
              l.addClass(this.domNode, "checked");
              this.emit("change", this.checked);
            },
            uncheck: function () {
              this.checked = !1;
              l.removeClass(this.domNode, "checked");
              this.emit("change", this.checked);
            },
            toggle: function () {
              this.checked ? this.uncheck() : this.check();
            },
            setValue: function (c) {
              this.checked !== c && this.toggle();
            },
          });
        }
      );
    },
    "dojo/NodeList": function () {
      define(["./query"], function (g) {
        return g.NodeList;
      });
    },
    "widgets/Filter/_build-generate_module": function () {
      define([
        "dojo/text!./Widget.html",
        "dojo/text!./css/style.css",
        "dojo/i18n!./nls/strings",
      ], function () {});
    },
    "url:jimu/dijit/templates/LayerChooserFromMapWithDropbox.html":
      '\x3cdiv\x3e\r\n  \x3ctable data-dojo-attach-event\x3d"onclick: _onDropDownClick"\x3e\r\n    \x3ccolgroup\x3e\r\n      \x3ccol width\x3d"10px"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"auto"\x3e\x3c/col\x3e\r\n      \x3ccol width\x3d"30px"\x3e\x3c/col\x3e\r\n    \x3c/colgroup\x3e\r\n    \x3ctbody\x3e\r\n      \x3ctr\x3e\r\n        \x3ctd\x3e\x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"layer-name jimu-ellipsis" data-dojo-attach-point\x3d"layerNameNode"\x3e\x3c/div\x3e\r\n        \x3c/td\x3e\r\n        \x3ctd\x3e\r\n          \x3cdiv class\x3d"drop-select jimu-float-trailing" data-dojo-attach-point\x3d"dropArrowNode"\x3e\r\n            \x3cdiv class\x3d"jimu-icon jimu-icon-down-arrow-8"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n        \x3c/td\x3e\r\n      \x3c/tr\x3e\r\n    \x3c/tbody\x3e\r\n  \x3c/table\x3e\r\n\x3c/div\x3e\r\n',
    "url:jimu/dijit/templates/_TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\x3e\r\n\t\t\x3cspan data-dojo-attach-point\x3d"contentNode" class\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\x3e\r\n\t\t\t\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem" tabindex\x3d"-1" aria-selected\x3d"false"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\x3e\r\n\t\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation" style\x3d"display: none;"\x3e\x3c/div\x3e\r\n\x3c/div\x3e',
    "url:dijit/templates/TreeNode.html":
      '\x3cdiv class\x3d"dijitTreeNode" role\x3d"presentation"\r\n\t\x3e\x3cdiv data-dojo-attach-point\x3d"rowNode" class\x3d"dijitTreeRow" role\x3d"presentation"\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNode" class\x3d"dijitInline dijitTreeExpando" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"expandoNodeText" class\x3d"dijitExpandoText" role\x3d"presentation"\x3e\x3c/span\r\n\t\t\x3e\x3cspan data-dojo-attach-point\x3d"contentNode"\r\n\t\t\tclass\x3d"dijitTreeContent" role\x3d"presentation"\x3e\r\n\t\t\t\x3cspan role\x3d"presentation" class\x3d"dijitInline dijitIcon dijitTreeIcon" data-dojo-attach-point\x3d"iconNode"\x3e\x3c/span\r\n\t\t\t\x3e\x3cspan data-dojo-attach-point\x3d"labelNode,focusNode" class\x3d"dijitTreeLabel" role\x3d"treeitem"\r\n\t\t\t\t   tabindex\x3d"-1" aria-selected\x3d"false" id\x3d"${id}_label"\x3e\x3c/span\x3e\r\n\t\t\x3c/span\r\n\t\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeNodeContainer" role\x3d"presentation"\r\n\t\t style\x3d"display: none;" aria-labelledby\x3d"${id}_label"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:dijit/templates/Tree.html":
      '\x3cdiv role\x3d"tree"\x3e\r\n\t\x3cdiv class\x3d"dijitInline dijitTreeIndent" style\x3d"position: absolute; top: -9999px" data-dojo-attach-point\x3d"indentDetector"\x3e\x3c/div\x3e\r\n\t\x3cdiv class\x3d"dijitTreeExpando dijitTreeExpandoLoading" data-dojo-attach-point\x3d"rootLoadingIndicator"\x3e\x3c/div\x3e\r\n\t\x3cdiv data-dojo-attach-point\x3d"containerNode" class\x3d"dijitTreeContainer" role\x3d"presentation"\x3e\r\n\t\x3c/div\x3e\r\n\x3c/div\x3e\r\n',
    "url:widgets/Filter/Widget.html":
      '\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"filterListContainerNode" style\x3d"height: 100%"\x3e\r\n    \x3cul class\x3d"filter-list" data-dojo-attach-point\x3d"filterList"\x3e\x3c/ul\x3e\r\n\r\n    \x3cdiv class\x3d"show-custom" data-dojo-attach-point\x3d"showCustomButtonNode" data-dojo-attach-event\x3d"click:_onShowCustomClick" title\x3d"${nls.createCustomFilter}"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n  \x3cdiv class\x3d"custom-filter" data-dojo-attach-point\x3d"customFilterContainerNode"\x3e\r\n    \x3cdiv class\x3d"title-part"\x3e\r\n      \x3cspan class\x3d"back-list" data-dojo-attach-event\x3d"click:_onBackToListClick"\x3e\x3c/span\x3e\r\n      \x3cspan\x3e${nls.customFilter}\x3c/span\x3e\r\n      \x3cdiv class\x3d"toggle-filter" data-dojo-type\x3d"jimu/dijit/ToggleButton" data-dojo-props\x3d"checked:true" title\x3d"${nls.toggleCustomFilters}" data-dojo-attach-event\x3d"change:_onCustomFilterToggle" data-dojo-attach-point\x3d"customFilterToggleButton"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv class\x3d"layer-part"\x3e\r\n      \x3cdiv class\x3d"layer-title"\x3e${jimuNls.common.layer}\x3c/div\x3e\r\n      \x3cdiv class\x3d"layer-select" data-dojo-attach-point\x3d"layerSelectNode"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\r\n    \x3cdiv class\x3d"custom-filter-node" data-dojo-attach-point\x3d"customFilterNode"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\r\n\x3c/div\x3e',
    "url:widgets/Filter/css/style.css":
      ".jimu-widget-filter {position: relative; width: auto; height: 100%; margin: -14px;}.jimu-widget-filter .filter-list{height: 100%; overflow-y: auto;}.jimu-widget-filter .filter-list,.jimu-widget-filter .filter-list li {margin: 0; padding: 0;}.jimu-widget-filter .filter-list li {list-style: none;}.jimu-widget-filter .filter-list .filter-item{border-bottom: 1px solid #eee; font-size: 12px; overflow: hidden;}.jimu-widget-filter .filter-list .filter-item.config-parameters{background-color: #f3f3f3;}.jimu-widget-filter .filter-list .filter-item.config-parameters + .filter-item.config-parameters{padding-top: 4px; background-clip: content-box;}.jimu-widget-filter .filter-list .filter-item .header{vertical-align: middle; padding: 12px 5px; min-height: 40px; cursor: pointer; position: relative;}.jimu-widget-filter .filter-list .filter-item .header:hover{background-color: #eee;}.jimu-widget-filter .filter-list .filter-item.config-parameters .header .item-title{font-family: 'Avenir Medium', Verdana, Geneva, sans-serif;}.jimu-widget-filter .filter-list .filter-item .body{display: none;}.jimu-widget-filter .filter-list .filter-item.config-parameters .body{display: block;}.jimu-widget-filter .filter-list .filter-item .header\x3e*{display: inline-block; vertical-align: middle; word-break: break-word;}.jimu-widget-filter .filter-list .filter-item .header\x3e.icon{vertical-align: top;}.jimu-widget-filter .filter-list .filter-item .header:after{content: \"\"; height: 100%; min-height: 16px; vertical-align: top; display: inline-block;}.jimu-widget-filter .filter-list .filter-item .header .icon{width: 16px; height: 16px; margin-right: 10px;}.jimu-rtl .jimu-widget-filter .filter-list .filter-item .header .icon{margin-right: 0; margin-left: 10px;}.jimu-widget-filter .filter-list .filter-item .header .icon img{width: 100%; height: 100%;}.jimu-widget-filter .filter-list .filter-item .header .toggle-filter{position: absolute; top: 14px; right: 0;}.jimu-rtl .jimu-widget-filter .filter-list .filter-item .header .toggle-filter{left: 0; right: auto;}.jimu-widget-filter .filter-list .filter-item .header .arrow{content: ''; border-radius: 50%; width: 16px; height: 16px; top: 12px; text-indent: -9999em; background: url('./images/arrow_normal.svg') no-repeat center; z-index: 10;}.jimu-widget-filter .filter-list .filter-item .header .arrow:hover{background: url('./images/arrow_hover.svg') no-repeat center;}.jimu-widget-filter .filter-list .filter-item.config-parameters .header .arrow{transform: rotate(90deg);}.jimu-widget-filter .filter-list .filter-item.not-has-ask-for-value .header .arrow{background: transparent !important;}.jimu-widget-filter .filter-list .filter-item .body .parameters{margin: 0 30px;}.jimu-widget-filter .filter-list .filter-item .body .jimu-btn{background: #fff; border-radius: 0; width: 82px; border: 1px solid #c7c7c7; color: #000; font-size: 12px; margin-bottom: 15px;}.jimu-widget-filter .filter-list .filter-item .body .jimu-btn:hover{border: 1px solid #000;}.jimu-widget-filter .jimu-loading-shelter .loading-container{width: auto;}.jimu-widget-filter.not-exist-ask-for-value .filter-list .filter-item .arrow{display: none;}.jimu-widget-filter .show-custom{position: absolute; bottom: 0px; right: 20px; width: 40px; height: 40px; border-radius: 20px; background-color: #333; border: 2px solid rgba(255, 255, 255, 0.5); background-image: url(images/custom_filter.svg); background-position: center; background-repeat: no-repeat; display: none; cursor: pointer;}.jimu-widget-filter .show-custom:hover{background-color: #666;}.jimu-rtl .jimu-widget-filter .show-custom{left: 20px; right: auto;}.jimu-widget-filter .custom-filter{display: none; height: 100%; position: relative;}.jimu-widget-filter .custom-filter .title-part{text-align: center; font-size: 16px; height: 50px; position: relative; border-bottom: 1px solid #ccc;}.jimu-widget-filter .custom-filter .title-part span{height: 50px; line-height: 50px;}.jimu-widget-filter .custom-filter .title-part .back-list{display: inline-block; height: 20px; width: 13px; position: absolute; left: 20px; cursor: pointer; margin-top: 15px; background: url(images/arrow_left_normal.svg);}.jimu-widget-filter .custom-filter .title-part .back-list:hover{background: url(images/arrow_left_hover.svg);}.jimu-rtl .jimu-widget-filter .custom-filter .title-part .back-list{right: 20px; left: auto; transform: rotate(180deg);}.jimu-widget-filter .custom-filter .custom-filter-node{height: calc(100% - 100px);}.jimu-widget-filter .custom-filter .layer-part{font-size: 14px; position: relative; margin: 10px 20px; display: flex;}.jimu-widget-filter .custom-filter .layer-part .layer-title{height: 30px; line-height: 30px; flex: 0 0 80px; white-space: nowrap;}.jimu-widget-filter .custom-filter .layer-part .layer-select{margin-left: 10px;}.jimu-widget-filter .custom-filter .toggle-filter{position: absolute; right: 20px; top: 15px;}.jimu-rtl .jimu-widget-filter .custom-filter .toggle-filter{left: 20px; right: auto;}@-webkit-keyframes load8 {0% {-webkit-transform: rotate(0deg); transform: rotate(0deg);} 100% {-webkit-transform: rotate(360deg); transform: rotate(360deg);}}@-moz-keyframes load8 {0% {-moz-transform: rotate(0deg); transform: rotate(0deg);} 100% {-moz-transform: rotate(360deg); transform: rotate(360deg);}}@-ms-keyframes load8 {0% {-ms-transform: rotate(0deg); transform: rotate(0deg);} 100% {-ms-transform: rotate(360deg); transform: rotate(360deg);}}@keyframes load8 {0% {-webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); -moz-transform: rotate(0deg); transform: rotate(0deg);} 100% {-webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); -moz-transform: rotate(360deg); transform: rotate(360deg);}}",
    "*now": function (g) {
      g([
        'dojo/i18n!*preload*widgets/Filter/nls/Widget*["ar","bs","cs","da","de","en","el","es","et","fi","fr","he","hi","hr","id","it","ja","ko","lt","lv","nb","nl","pl","pt-br","pt-pt","ro","ru","sl","sr","sv","th","tr","zh-cn","vi","zh-hk","zh-tw","ROOT"]',
      ]);
    },
    "*noref": 1,
  },
});
define(
  "dojo/_base/declare dojo/_base/array dojo/_base/html dojo/_base/lang dojo/query dojo/on dijit/_WidgetsInTemplateMixin jimu/utils jimu/BaseWidget jimu/filterUtils jimu/dijit/FilterParameters jimu/LayerInfos/LayerInfos jimu/FilterManager esri/request jimu/dijit/LayerChooserFromMapWithDropbox jimu/dijit/Filter ./CustomFeaturelayerChooserFromMap jimu/dijit/ToggleButton dojo/NodeList dojo/NodeList-dom".split(
    " "
  ),
  function (g, m, k, l, d, c, f, h, v, w, q, a, r, p, y, n, t, C) {
    return g([v, f], {
      name: "Filter",
      baseClass: "jimu-widget-filter",
      _itemTemplate:
        '\x3cli class\x3d"filter-item" data-index\x3d"${index}"\x3e\x3cdiv class\x3d"header" \x3e\x3cspan class\x3d"arrow jimu-float-leading jimu-trailing-margin05" title\x3d"${toggleTip}" \x3e\x3c/span\x3e\x3cspan class\x3d"icon"\x3e\x3cimg src\x3d"${icon}" /\x3e\x3c/span\x3e\x3cspan class\x3d"item-title"\x3e${title}\x3c/span\x3e\x3cspan class\x3d"toggle-filter jimu-trailing-margin1"\x3e\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"body"\x3e\x3cdiv class\x3d"parameters"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/li\x3e',
      _store: null,
      postMixInProperties: function () {
        this.jimuNls = window.jimuNls;
      },
      postCreate: function () {
        this.inherited(arguments);
        this._store = {};
        this.layerInfosObj = a.getInstanceSync();
        this.filterUtils = new w();
        this.filterManager = r.getInstance();
        this.config.allowCustom &&
          k.setStyle(this.showCustomButtonNode, "display", "block");
        var c = !1;
        m.forEach(
          this.config.filters,
          function (a, e) {
            var b = this.filterUtils.isAskForValues(a.filter);
            b && (c = !0);
            var f = {
              icon: a.icon
                ? h.processUrlInWidgetConfig(a.icon, this.folderUrl)
                : this.folderUrl + "/css/images/default_task_icon.png",
              index: e,
              title: a.name,
              toggleTip: this.nls.toggleTip,
              hasValue: b
                ? window.appInfo.isRunInMobile
                  ? "block !important"
                  : ""
                : "none",
              isAskForValue: b,
              apply: l.getObject("jimuNls.common.apply", !1, window) || "Apply",
            };
            this._store[a.layerId] ||
              (this._store[a.layerId] = { mapFilterControls: {} });
            e = l.replace(this._itemTemplate, f, /\$\{([^\}]+)\}/gi);
            var g = k.toDom(e);
            k.place(g, this.filterList);
            e = new C({}, d(".toggle-filter", g)[0]);
            e.startup();
            g.toggleButton = e;
            this.own(
              d(".header", g).on(
                "click",
                l.hitch(this, "toggleFilter", g, a, f)
              )
            );
            b
              ? k.addClass(g, "has-ask-for-value")
              : k.addClass(g, "not-has-ask-for-value");
            "none" !== f.hasValue
              ? (this.own(
                  d(".arrow", g).on(
                    "click",
                    l.hitch(this, "configFilter", g, a)
                  )
                ),
                k.addClass(g, "requesting"),
                this.configFilter(
                  g,
                  a,
                  null,
                  l.hitch(this, function () {
                    a.collapse && k.removeClass(g, "config-parameters");
                    a.autoApplyWhenWidgetOpen && this.toggleFilter(g, a, f);
                  })
                ))
              : a.autoApplyWhenWidgetOpen && this.toggleFilter(g, a, f);
          },
          this
        );
        c || k.addClass(this.domNode, "not-exist-ask-for-value");
      },
      startup: function () {
        this.inherited(arguments);
        this.resize();
      },
      _getPriorityOfMapFilter: function (a) {
        a = l.getObject(a + ".mapFilterControls", !1, this._store);
        var b = 0,
          c;
        for (c in a) {
          var e = a[c];
          e.priority > b && (b = e.priority);
        }
        return b;
      },
      _getMapFilterControl: function (a) {
        a = l.getObject(a + ".mapFilterControls", !1, this._store);
        var b = !0,
          c;
        for (c in a) {
          var e = a[c];
          0 < e.priority && (b = !!e.enable);
        }
        return b;
      },
      _setItemFilter: function (a, b, c, d) {
        this._store[a]["filter_item_" + b] = c;
        c = this._getPriorityOfMapFilter(a);
        l.setObject(
          a + ".mapFilterControls.filter_item_" + b,
          { enable: d, priority: c + 1 },
          this._store
        );
      },
      _removeItemFilter: function (a, b) {
        delete this._store[a]["filter_item_" + b];
        delete this._store[a].mapFilterControls["filter_item_" + b];
      },
      _getExpr: function (a) {
        if (!this._store[a]) return null;
        var b = [];
        a = this._store[a];
        for (var c in a) {
          var d = a[c];
          d && "mapFilterControls" !== c && b.push("(" + d + ")");
        }
        return b.join(" AND ");
      },
      toggleFilter: function (a, b, c) {
        if (
          !k.hasClass(a, "config-parameters") ||
          (a.filterParams && a.filterParams.getFilterExpr())
        )
          if (
            !c.isAskForValue ||
            (a.filterParams && a.filterParams.getFilterExpr())
          ) {
            c = b.layerId;
            var d = k.getAttr(a, "data-index"),
              e = null;
            (e = k.hasClass(a, "applied"))
              ? (k.removeClass(a, "applied"), a.toggleButton.uncheck())
              : (k.addClass(a, "applied"), a.toggleButton.check());
            var f = null;
            e
              ? this._removeItemFilter(c, d)
              : ((a = this._getFilterExpr(a, b)),
                this._setItemFilter(c, d, a, b.enableMapFilter));
            e = this._getExpr(c);
            f = this._getMapFilterControl(c);
            this.filterManager.applyWidgetFilter(c, this.id, e, f);
            this._afterFilterApplied(b.layerId);
          } else this.configFilter(a, b);
      },
      configFilter: function (a, b, f, g) {
        a.filterParams
          ? (k.hasClass(a, "config-parameters")
              ? (k.removeClass(a, "config-parameters"),
                this._changeItemTitleWidth(
                  a,
                  window.appInfo.isRunInMobile ? 60 : 45
                ))
              : (k.addClass(a, "config-parameters"),
                this._changeItemTitleWidth(a, 60)),
            g && g())
          : p({
              url: b.url,
              content: { f: "json" },
              handleAs: "json",
              callbackPrams: "callback",
            }).then(
              l.hitch(this, function (e) {
                k.addClass(a, "config-parameters");
                k.removeClass(a, "requesting");
                var f = d(".parameters", a)[0];
                a.handles = [];
                a.filterParams = new q();
                var h = l.clone(b.filter),
                  m = null;
                b.enableMapFilter && (m = b.layerId);
                a.filterParams.build(b.url, e, h, m);
                this.own(
                  c(
                    a.filterParams,
                    "change",
                    l.hitch(this, function (c) {
                      c ? (a.expr = c) : delete a.expr;
                      a.toggleButton.checked && this.applyFilterValues(a, b);
                    })
                  )
                );
                a.expr = a.filterParams.getFilterExpr();
                a.filterParams.placeAt(f);
                this._changeItemTitleWidth(a, 60);
                g && g();
              })
            );
        f && f.target && f.stopPropagation();
      },
      applyFilterValues: function (a, b, c) {
        var d = this._getFilterExpr(a, b);
        if (d) {
          a.expr = d;
          var d = b.layerId,
            e = k.getAttr(a, "data-index");
          k.addClass(a, "applied");
          this._setItemFilter(d, e, a.expr, b.enableMapFilter);
          a = this._getExpr(d);
          e = this._getMapFilterControl(d);
          this.filterManager.applyWidgetFilter(d, this.id, a, e);
          this._afterFilterApplied(b.layerId);
        }
        c && c.stopPropagation();
      },
      _getFilterExpr: function (a, b) {
        return a.filterParams
          ? a.filterParams.getFilterExpr()
          : this.filterUtils.hasVirtualDate(b.filter)
          ? ((this.filterUtils.isHosted = h.isHostedService(b.url)),
            this.filterUtils.getExprByFilterObj(b.filter))
          : b.filter.expr;
      },
      _afterFilterApplied: function (a) {
        this.config.zoomto &&
          (a = this.layerInfosObj.getLayerInfoById(a)) &&
          a.zoomTo();
      },
      _isValidExtent: function (a) {
        return !(
          isNaN(a.xmax) ||
          isNaN(a.xmax) ||
          isNaN(a.xmax) ||
          isNaN(a.xmax)
        );
      },
      resize: function () {
        this.inherited(arguments);
        this._changeItemTitleWidth(
          this.domNode,
          window.appInfo.isRunInMobile ? 60 : 45
        );
        this.customFilter && this.customFilter.resize();
      },
      _changeItemTitleWidth: function (a, b) {
        b += 30;
        var c = d(".header", a)[0];
        c &&
          ((b = k.getContentBox(c).w - b),
          0 < b && d(".header .item-title", a).style({ maxWidth: b + "px" }));
      },
      _onShowCustomClick: function () {
        k.setStyle(this.customFilterContainerNode, "display", "block");
        k.setStyle(this.filterListContainerNode, "display", "none");
        if (!this.layerChooserSelect) {
          var a = new t({
            showLayerFromFeatureSet: !1,
            showTable: !1,
            onlyShowVisible: !1,
            createMapResponse: this.map.webMapResponse,
          });
          this.layerChooserSelect = new y({ layerChooser: a });
          this.layerChooserSelect.placeAt(this.layerSelectNode);
          this.own(
            c(
              this.layerChooserSelect,
              "selection-change",
              l.hitch(this, this._onLayerChanged)
            )
          );
          this.layerChooserSelect.showLayerChooser();
        }
      },
      _onLayerChanged: function () {
        var a = this.layerChooserSelect.getSelectedItem();
        if (a) {
          var a = a.layerInfo.layerObject,
            b = this._getLayerDefinitionForFilterDijit(a);
          this.customFilter ||
            ((this.customFilter = new n({
              enableAskForValues: !1,
              featureLayerId: a.id,
            })),
            this.customFilter.placeAt(this.customFilterNode),
            this.own(
              c(
                this.customFilter,
                "change",
                l.hitch(this, this._onCustomFilterChange)
              )
            ));
          this.customFilter.build({
            url: a.url,
            featureLayerId: a.id,
            layerDefinition: b,
          });
          this.selectedLayer = a;
        }
      },
      _getLayerDefinitionForFilterDijit: function (a) {
        var b = null;
        "esri.layers.FeatureLayer" === a.declaredClass &&
          (b = h.getFeatureLayerDefinition(a));
        b ||
          (b = { currentVersion: a.currentVersion, fields: l.clone(a.fields) });
        return b;
      },
      _onBackToListClick: function () {
        k.setStyle(this.customFilterContainerNode, "display", "none");
        k.setStyle(this.filterListContainerNode, "display", "block");
      },
      _onCustomFilterToggle: function (a) {
        this.customFilter &&
          (a
            ? this._applyCustomFilter()
            : (this.filterManager.applyWidgetFilter(
                this.selectedLayer.id,
                this.id + "-custom-filter",
                "1\x3d1",
                !0
              ),
              this._afterFilterApplied(this.selectedLayer.id)));
      },
      _onCustomFilterChange: function () {
        this._applyCustomFilter();
      },
      _applyCustomFilter: function () {
        var a = this.customFilter.toJson();
        a &&
          this.customFilterToggleButton.checked &&
          0 !== a.parts.length &&
          (this.filterManager.applyWidgetFilter(
            this.selectedLayer.id,
            this.id + "-custom-filter",
            a.expr,
            !0
          ),
          this._afterFilterApplied(this.selectedLayer.id));
      },
      destroy: function () {
        d(".filter-item", this.filterList).forEach(function (a) {
          delete a.filterParams;
          delete a.expr;
        });
        if (this._store)
          for (var a in this._store)
            a && this.filterManager.applyWidgetFilter(a, this.id, "", null);
        this.inherited(arguments);
      },
    });
  }
);
