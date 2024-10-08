///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(function() {
    var mo = {};

    mo.declaredClass = 'jimu.shared.basePortalUrlUtils';

    if(typeof String.prototype.trim !== 'function'){
      String.prototype.trim = function(){
        return this.replace(/^\s*/gi, '').replace(/\s*$/gi, '');
      };
    }

    if(typeof String.prototype.startWith !== 'function'){
      String.prototype.startWith = function(str) {
        return this.substr(0, str.length) === str;
      };
    }

    if(typeof String.prototype.endWith !== 'function'){
      String.prototype.endWith = function(str) {
        return this.substr(this.length - str.length, str.length) === str;
      };
    }

    //return the host (with port if possible)
    //http://www.arcgis.com/sharing => www.arcgis.com
    mo.getServerByUrl = function(_url){
      _url = (_url || '').trim();
      _url = _url.replace(/^(http(s?):?)\/\//gi, '');

      if(_url.indexOf('//') === 0){
        _url = _url.slice(2);
      }

      return _url.split('/')[0];
    };

    //return the host with protocol
    //http://www.arcgis.com/sharing => http://www.arcgis.com
    mo.getServerWithProtocol = function(_url){
      var result = '';
      _url = (_url || '').trim();

      if(_url){
        var server = mo.getServerByUrl(_url);

        if(!server){
          return result;
        }

        var protocol = mo.getProtocol(_url);

        if(protocol){
          result = protocol + "://" + server;
        }
        else if(_url.indexOf('//') === 0){
          result = "//" + server;
        }
      }

      return result;
    };

    mo.isSameServer = function(_url1, _url2){
      _url1 = mo.getServerByUrl(_url1) || "";
      _url2 = mo.getServerByUrl(_url2) || "";
      return _url1.toLowerCase() === _url2.toLowerCase();
    };

    //return host name without port
    mo.getDomain = function(url) {
      var serverName, matched, result = '';

      serverName = mo.getServerByUrl(url);
      if (serverName) {
        serverName = serverName.replace(/:\d+$/, '');
        matched = serverName.match(/[^.]\w+\.\w+$/);
        if (matched !== null) {
          result = matched[0];
          // if the url is an IP address, it isn't a valid domain
          if (/^\d+\.\d+$/.test(result)) {
            result = '';
          }
        }
      }
      return result;
    };

    mo.isSameDomain = function(url1, url2) {
      var domain1 = mo.getDomain(url1),
        domain2 = mo.getDomain(url2);

      return domain1 !== '' && domain1 === domain2;
    };

    mo.isOrgOnline = function(_url){
      var server = mo.getServerByUrl(_url).toLowerCase();
      return server.indexOf('.maps.arcgis.com') >= 0;
    };

    mo.isOnline = function(_url){
      var server = mo.getServerByUrl(_url).toLowerCase();
      return server.indexOf('.arcgis.com') >= 0;
    };

    mo.isArcGIScom = function(_url){
      var server = mo.getServerByUrl(_url).toLowerCase();
      return server === 'www.arcgis.com' || server === 'arcgis.com';
    };

    //get standard portal url without 'sharing'
    //http://www.arcgis.com/sharing/rest/ => http://www.arcgis.com
    mo.getStandardPortalUrl = function(_portalUrl){
      var server = mo.getServerByUrl(_portalUrl);
      if (server === '') {
        return '';
      }
      if (mo.isOnline(server)) {
        if(mo.isArcGIScom(server)){
          server = 'www.arcgis.com';
        }
        _portalUrl = mo.addProtocol(_portalUrl);
        var protocol = mo.getProtocol(_portalUrl);
        _portalUrl = protocol + '://' + server;
      } else {
        _portalUrl = (_portalUrl || '').trim().replace(/sharing(.*)/gi, '').replace(/\/*$/g, '');
        _portalUrl = mo.addProtocol(_portalUrl);
        var pattStr = 'http(s?):\/\/' + server;
        var pattern = new RegExp(pattStr, 'g');
        var nail = _portalUrl.replace(pattern, '');
        if (!nail) {
          _portalUrl = _portalUrl + '/arcgis';
        }
      }

      return _portalUrl;
    };

    mo.isSamePortalUrl = function(_portalUrl1, _portalUrl2){
      //test: http://www.arcgis.com/sharing/rest === https://www.arcgis.com
      //test: http://www.arcgis.com/ === https://www.arcgis.com
      //test: //www.arcgis.com/sharing/rest === https://www.arcgis.com/
      var patt1 = /^http(s?):\/\//gi;
      var patt2 = /^\/\//gi;
      _portalUrl1 = mo.getStandardPortalUrl(_portalUrl1).toLowerCase().replace(patt1, '').replace(patt2, '');
      _portalUrl2 = mo.getStandardPortalUrl(_portalUrl2).toLowerCase().replace(patt1, '').replace(patt2, '');
      return _portalUrl1 === _portalUrl2;
    };

    //add protocol for url if it doesn't have protocol
    mo.addProtocol = function(url){
      var noProtocol = url.toLowerCase().indexOf('http://') <= -1 &&
       url.toLowerCase().indexOf('https://') <= -1;

      if(noProtocol){
        var defaultProtocol = '';
        if(typeof window !== 'undefined' && window.location) {
          //for client side
          defaultProtocol = window.location.protocol;
          if (url.startWith('//')) {
            url = defaultProtocol + url; //http: + //js.arcgis.com
          } else if (url.startWith('/')) {
            // http: + // + localhost + /proxy.js
            url = defaultProtocol + "//" + window.location.host + url;
          } else {
            url = defaultProtocol + "//" + url; //http: + // + www.arcgis.com
          }
        }
        else{
          //for server side
          defaultProtocol = 'http:';
          if (url.startWith('//')) {
            url = defaultProtocol + url; //http: + //js.arcgis.com
          } else {
            url = defaultProtocol + "//" + url;
          }
        }

      }
      return url;
    };

    mo.getProtocol = function(url){
      //test: http://www.arcgis.com => http
      //test: https://www.arcgis.com => https
      //test: //www.arcgis.com => ''
      var protocol = '';
      url = url.toLowerCase();
      if(url.indexOf('https://') === 0){
        protocol = 'https';
      }
      else if(url.indexOf('http://') === 0){
        protocol = 'http';
      }
      return protocol;
    };

    mo.updateUrlProtocolByOtherUrl = function(url, otherUrl){
      otherUrl = otherUrl.toLowerCase();
      if(otherUrl.indexOf('https://') === 0){
        url = mo.setHttpsProtocol(url);
      }else if(otherUrl.indexOf('http://') === 0){
        url = mo.setHttpProtocol(url);
      }
      return url;
    };

    mo.removeProtocol = function(_url){
      //test: http://www.arcgis.com => //www.arcgis.com
      //test: https://www.arcgis.com => //www.arcgis.com
      return _url.replace(/^http(s?):\/\//i, '//');
    };

    mo.setHttpProtocol = function(_url){
      _url = mo.addProtocol(_url);
      var reg = /^https:\/\//;
      var url = _url.replace(reg, 'http://');
      return url;
    };

    mo.setHttpsProtocol = function(_url){
      _url = mo.addProtocol(_url);
      var reg = /^http:\/\//;
      var url = _url.replace(reg, 'https://');
      return url;
    };

    mo.setProtocol = function(_url, protocol){
      if(protocol.indexOf('https') >= 0){
        return mo.setHttpsProtocol(_url);
      }else if(protocol.indexOf('http') >= 0){
        return mo.setHttpProtocol(_url);
      } else {
        return _url;
      }
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest
    mo.getSharingUrl = function(_portalUrl){
      var sharingUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        sharingUrl = portalUrl + '/sharing/rest';
      }
      return sharingUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/oauth2
    mo.getOAuth2Url = function(_portalUrl){
      var oauth2Url = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        oauth2Url = portalUrl + '/sharing/rest/oauth2';
      }
      return oauth2Url;
    };

    //http://www.arcgis.com,a5adfxf3df => http://www.arcgis.com/sharing/rest/oauth2/apps/a5adfxf3df
    mo.getAppIdUrl = function(_portalUrl, _appId){
      var appIdUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        appIdUrl = portalUrl + '/sharing/rest/oauth2/apps/' + _appId;
      }
      return appIdUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/signin.html
    mo.getSignInUrl = function(_portalUrl){
      var signInUrl = "";
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        signInUrl = portalUrl + "/home/signin.html";
      }
      return signInUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/search
    mo.getBaseSearchUrl = function(_portalUrl){
      var searchUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      portalUrl = portalUrl.replace(/\/*$/g, '');
      if(portalUrl){
        searchUrl = portalUrl + '/sharing/rest/search';
      }
      return searchUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/content/items
    mo.getBaseItemUrl = function(_portalUrl){
      var baseItemUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        baseItemUrl = portalUrl + '/sharing/rest/content/items';
      }
      return baseItemUrl;
    };

    //http://www.arcgis.com,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/sharing/rest/content/items/dc99396ecacd4873a4e78124db435076
    mo.getItemUrl = function(_portalUrl, _itemId){
      var itemUrl = '';
      var baseItemUrl = mo.getBaseItemUrl(_portalUrl);
      if(baseItemUrl && _itemId){
        itemUrl = baseItemUrl + '/' + _itemId;
      }
      return itemUrl;
    };

    //http://www.arcgis.com,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/sharing/rest/content/items/dc99396ecacd4873a4e78124db435076/data
    mo.getItemDataUrl = function(_portalUrl, _itemId){
      var itemDataUrl = '';
      var itemUrl = mo.getItemUrl(_portalUrl, _itemId);
      if(itemUrl){
        itemDataUrl = itemUrl + '/data';
      }
      return itemDataUrl;
    };

    //http://www.arcgis.com,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/sharing/rest/content/items/dc99396ecacd4873a4e78124db435076/groups
    mo.getItemGroupsUrl = function(_portalUrl, _itemId){
      var itemDataUrl = '';
      var itemUrl = mo.getItemUrl(_portalUrl, _itemId);
      if(itemUrl){
        itemDataUrl = itemUrl + '/groups';
      }
      return itemDataUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/generateToken
    mo.getGenerateTokenUrl = function(_portalUrl){
      var tokenUrl = '';
      _portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(_portalUrl){
        // tokenUrl = _portalUrl + '/sharing/rest/generateToken';
        // The url should not include 'rest' because portal 10.3 doesn't support GET method with 'rest' and
        // get following error
        // {"error":{"code":405,"messageCode":"GWM_0005","message":"Method not supported.","details":[]}}
        tokenUrl = _portalUrl + '/sharing/generateToken';
      }
      return tokenUrl;
    };

    //http://www.arcgis.com,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/home/item.html?id=dc99396ecacd4873a4e78124db435076
    mo.getItemDetailsPageUrl = function(_portalUrl, _itemId){
      var url = '';
      if(_portalUrl && _itemId){
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        url = _portalUrl + "/home/item.html?id=" + _itemId;
      }
      return url;
    };

    //http://www.arcgis.com,user1 => http://www.arcgis.com/home/user.html?user=user1
    mo.getUserProfilePageUrl = function(_portalUrl, _user){
      var url = '';
      if(_portalUrl && _user){
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        url = _portalUrl + '/home/user.html?user=' + _user;
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/community/groups
    mo.getBaseGroupUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/rest/community/groups';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/portals/self
    mo.getPortalSelfInfoUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = _portalUrl || '';
      thePortalUrl = mo.getStandardPortalUrl(thePortalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/rest/portals/self';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/portals/helpmap
    mo.getPortalHelpMapUrl = function(_portalUrl){
      console.log(_portalUrl);
      console.log('0000000000');
      var url = '';
      var thePortalUrl = _portalUrl || '';
      thePortalUrl = mo.getStandardPortalUrl(thePortalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/rest/portals/helpmap';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/community/self
    mo.getCommunitySelfUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = _portalUrl || '';
      thePortalUrl = mo.getStandardPortalUrl(thePortalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/rest/community/self';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/community/users
    mo.getBaseUserUrl = function(_portalUrl){
      var baseUserUrl = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        baseUserUrl = portalUrl + '/sharing/rest/community/users';
      }
      return baseUserUrl;
    };

    //http://www.arcgis.com,user1 => http://www.arcgis.com/sharing/rest/community/users/user1
    mo.getUserUrl = function(_portalUrl, _userId){
      var userUrl = '';
      var baseUserUrl = mo.getBaseUserUrl(_portalUrl);
      if(_portalUrl && _userId){
        userUrl = baseUserUrl + '/' + _userId;
      }
      return userUrl;
    };

    //http://www.arcgis.com,user1 => http://www.arcgis.com/sharing/rest/community/users/user1/tags
    mo.getUserTagsUrl = function(_portalUrl, _userId){
      var userTagsUrl = '';
      var userUrl = mo.getUserUrl(_portalUrl, _userId);
      if(_portalUrl && _userId){
        userTagsUrl = userUrl + '/tags';
      }
      return userTagsUrl;
    };

    //http://www.arcgis.com,user1,thumbnail1 => http://www.arcgis.com/sharing/rest/community/users/user1/info/thumbnail1
    mo.getUserThumbnailUrl = function(portalUrl, userId, thumbnail){
      var thumbnailUrl = "";
      var userUrl = mo.getUserUrl(portalUrl, userId);
      if(userUrl && thumbnail){
        thumbnailUrl = userUrl + '/info/' + thumbnail;
      }
      return thumbnailUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/content
    mo.getContentUrl = function(_portalUrl){
      var contentUrl = '';
      if(_portalUrl) {
        _portalUrl = mo.getStandardPortalUrl(_portalUrl);
        contentUrl = _portalUrl + '/sharing/rest/content';
      }
      return contentUrl;
    };

    //http://www.arcgis.com,user1,folder1 => http://www.arcgis.com/sharing/rest/content/users/user1/folder1
    mo.getUserContentUrl = function(_portalUrl, _user, _folderId){
      var contentUrl = '', userContentUrl = '';
      if(_portalUrl && _user) {
        contentUrl = mo.getContentUrl(_portalUrl);
        if(_folderId) {
          userContentUrl = contentUrl + '/users/' + _user + '/' + _folderId;
        } else {
          userContentUrl = contentUrl + '/users/' + _user;
        }
      }
      return userContentUrl;
    };

    //http://www.arcgis.com,user1,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/sharing/rest/content/users/user1/items/dc99396ecacd4873a4e78124db435076
    mo.getUserContentItemUrl = function(_portalUrl, _user, _itemId){
      var userContentUrl = '',userContentItemUrl = '';
      if(_portalUrl && _user && _itemId) {
        userContentUrl = mo.getUserContentUrl(_portalUrl, _user);
        userContentItemUrl = userContentUrl + '/items/' + _itemId;
      }
      return userContentItemUrl;
    };

    mo.getItemResourceUrl = function(_portalUrl, _itemId, _customResUrl){
      var contentUrl = '',itemResourceUrl = '';
      if(_portalUrl && _itemId) {
        contentUrl = mo.getContentUrl(_portalUrl);
        if(_customResUrl){
          itemResourceUrl = contentUrl + '/items/' + _itemId + '/resources/' + _customResUrl;
        }else{
          itemResourceUrl = contentUrl + '/items/' + _itemId + '/resources';
        }
      }
      return itemResourceUrl;
    };

    //http://www.arcgis.com,user1,folder1 => http://www.arcgis.com/sharing/rest/content/users/user1/folder1/addItem
    mo.getAddItemUrl = function(_portalUrl, _user, _folderId){
      var userContentUrl = '', addItemUrl = '';
      if(_portalUrl && _user) {
        userContentUrl = mo.getUserContentUrl(_portalUrl, _user, _folderId);
        addItemUrl = userContentUrl + '/addItem' ;
      }
      return addItemUrl;
    };

    //http://www.arcgis.com,user1,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/sharing/rest/content/users/user1/items/dc99396ecacd4873a4e78124db435076/delete
    mo.getDeleteItemUrl = function(_portalUrl, _user, _itemId){
      var deleteItemUrl = '';
      var userItemsUrl = mo.getUserItemsUrl(_portalUrl, _user);
      if(userItemsUrl){
        deleteItemUrl = userItemsUrl + '/' + _itemId + '/delete';
      }
      return deleteItemUrl;
    };


    //http://www.arcgis.com,user1,folder1 => http://www.arcgis.com/sharing/rest/content/users/user1/folder1/items
    mo.getUserItemsUrl = function(_portalUrl, _user, _folderId) {
      var userContentUrl = '', userItemsUrl = '';
      if(_portalUrl && _user) {
        userContentUrl = mo.getUserContentUrl(_portalUrl, _user, _folderId);
        userItemsUrl = userContentUrl + '/items' ;
      }
      return userItemsUrl;
    };

    //http://www.arcgis.com,user1,dc99396ecacd4873a4e78124db435076,folder1 =>
    //http://www.arcgis.com/sharing/rest/content/users/user1/folder1/items/dc99396ecacd4873a4e78124db435076/update
    mo.getUpdateItemUrl = function(_portalUrl, _user, _itemId, _folderId) {
      var userItemsUrl = '', updateItem = '';
      if(_portalUrl && _user) {
        userItemsUrl = mo.getUserItemsUrl(_portalUrl, _user, _folderId);
        updateItem = userItemsUrl + '/' + _itemId + "/update";
      }
      return updateItem;
    };

    //http://www.arcgis.com,user1,dc99396ecacd4873a4e78124db435076,folder1 =>
    //http://www.arcgis.com/sharing/rest/content/users/user1/folder1/items/dc99396ecacd4873a4e78124db435076/share
    mo.shareItemUrl = function(_portalUrl, _user, _itemId, _folderId) {
      var userItemsUrl = '', shareItemUrl = '';
      if(_portalUrl && _user) {
        userItemsUrl = mo.getUserItemsUrl(_portalUrl, _user, _folderId);
        shareItemUrl = userItemsUrl + '/' + _itemId + "/share";
      }
      return shareItemUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/index.html
    mo.getHomeIndexUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/index.html';
      }
      return url;
    };

    //http://www.arcgis.com,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/home/webmap/viewer.html?webmap=dc99396ecacd4873a4e78124db435076
    mo.getHomeMapViewerUrl = function(_portalUrl, /* optional */ itemId){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/webmap/viewer.html';
        if(itemId){
          url += "?webmap=" + itemId;
        }
        else{
          url += "?useExisting=1";
        }
      }
      return url;
    };

    //http://www.arcgis.com,dc99396ecacd4873a4e78124db435076 =>
    //http://www.arcgis.com/home/webscene/viewer.html?webscene=dc99396ecacd4873a4e78124db435076
    mo.getHomeSceneViewerUrl = function(_portalUrl, /* optional */ itemId){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/webscene/viewer.html';
        if(itemId){
          url += "?webscene=" + itemId;
        }
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/gallery.html
    mo.getHomeGalleryUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/gallery.html';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/groups.html
    mo.getHomeGroupsUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/groups.html';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/content.html
    mo.getHomeMyContentUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/content.html';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/organization.html
    mo.getHomeMyOrganizationUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/organization.html';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/home/user.html
    mo.getHomeUserUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/home/user.html';
      }
      return url;
    };

    //locale is optional, default value is 'en'
    //http://www.arcgis.com,en => http://www.arcgis.com/portalhelp/en/portal/
    mo.getPortalHelpUrl = function(_portalUrl, locale){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        var l = locale || "en";
        url = thePortalUrl + "/portalhelp/" + l + "/portal/";
      }
      return url;
    };

    //http://www.arcgis.com,en => http://www.arcgis.com/portalhelp/en/admin/help/
    mo.getPortalAdminHelpUrl = function(_portalUrl, locale){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        var l = locale || "en";
        url = thePortalUrl + '/portalhelp/' + l + "/admin/help/";
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/proxy
    mo.getPortalProxyUrl = function(_portalUrl){
      //examples:
      //http://esridevbeijing.maps.arcgis.com/sharing/proxy
      //http://gallery.chn.esri.com/arcgis/sharing/proxy
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        url = thePortalUrl + '/sharing/proxy';
      }
      return url;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/rest/oauth2/signout
    mo.getOAuth2SignOutUrl = function(_portalUrl){
      var signOutUrl = "";
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        signOutUrl = portalUrl + '/sharing/rest/oauth2/signout';//?redirect_uri=http://...
      }
      return signOutUrl;
    };

    //http://www.arcgis.com => http://www.arcgis.com/sharing/tools/newPrint
    mo.getNewPrintUrl = function(_portalUrl){
      var url = '';
      var thePortalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(thePortalUrl){
        thePortalUrl = mo.setHttpProtocol(thePortalUrl);
        url = thePortalUrl + '/sharing/tools/newPrint';
      }
      return url;
    };

    //http://www.arcgis.com,axf5d83dfa =>
    //https://www.arcgis.com/home/pages/Account/manage_accounts.html#client_id=axf5d83dfa
    mo.getSwitchAccoutnsUrl = function(_portalUrl, client_id, /*optional*/ redirect_uri){
      var url = '';
      var portalUrl = mo.getStandardPortalUrl(_portalUrl);
      if(portalUrl){
        url = portalUrl + "/home/pages/Account/manage_accounts.html#client_id=" + client_id;
        if(redirect_uri){
          url += "&redirect_uri=" + redirect_uri;
        }
      }
      if(url){
        url = mo.setHttpsProtocol(url);
      }
      return url;
    };

    return mo;
  });
