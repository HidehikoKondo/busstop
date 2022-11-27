// <!--マップの制御 -->
let map;
let infoWindow;
let currenMarker;
var selectedLatLng;
var selectedAddress;

//マップの初期化
function initMap() {
    //初期化
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapId: '9664d4d621b2e362'
    });

    // マップの設定
    var options = {
        center: new google.maps.LatLng(35, 139),
        zoom: 12,
        clickableIcons: false,
        disableDefaultUI: false,
        disableDoubleClickZoom: false,
        draggable: true,
        // draggableCursor: "url(./cursor.png), auto",
        // draggingCursor: "url(./cursor.png), auto",
        fullscreenControl: false,
        gestureHandling: true,
        heading: 0,
        keyboardShortcuts: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 20,
        minZoom: 10,
        rotateControl: true,
        scaleControl: false,
        scrollwheel: true,
        streetViewControl: false,
        tilt: 110,
        zoomControl: true,
    };
    map.setOptions(options);


    //カメラの設定
    map.moveCamera({
        center: new google.maps.LatLng(37.7893719, -122.3942),
        zoom: 16,
        heading: 320,
        tilt: 90
    });

    //現在地用のマーカー
    currenMarker = new google.maps.Marker({
        position: { lat: 35.1709076, lng: 136.9074532 },
        map: map,
        title: "現在地",
        icon: "images/currentPosition.svg",
    });

    // 現在地のマーカーをクリックしたとき
    currenMarker.addListener("click", function (e) {
        selectedLatLng = currenMarker.position;
        infoWindow.close();
        app.showFromTemplate();
        infoWindow.open(map, currenMarker); // 吹き出しの表示
    });

    //吹き出し
    infoWindow = new google.maps.InfoWindow({
        // 吹き出しの追加
        content: "<h4>島田住宅行き</h4><strong>10:21</strong><hr><h4>島田住宅行き</h4><strong>10:21</strong><hr><h4>島田住宅行き</h4><strong>10:21</strong><hr><h4>島田住宅行き</h4><strong>10:21</strong><hr><h4>島田住宅行き</h4><strong>10:21</strong><hr><h4>島田住宅行き</h4><strong>10:21</strong><hr><h4>島田住宅行き</h4><strong>10:21</strong><hr>",
        ariaLabel: "島田住宅行き"
    });

    //起動後に現在地に移動
    currentPosition();


    // マーカー（クリック）
    var marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        draggable: true,
    });

    // マーカーをクリックしたとき
    marker.addListener("click", function () {
        selectedLatLng = marker.position;
        infoWindow.close(); // 吹き出しの表示l
        app.showFromTemplate();
    });

    // マーカーをドラッグ後
    marker.addListener("dragend", function () {
        selectedLatLng = marker.position;
    });

    //マップのクリックイベント
    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map, marker);
    });
    // マーカーの配置とマーカーの位置に移動
    function placeMarkerAndPanTo(latLng, map, marker) {
        marker.setPosition(latLng);
        map.panTo(latLng);
        infoWindow.open(map, marker);
        infoWindow.content = "<h1>xxwwwx</h1>";
        infoWindow.ariaLabel = "島田住宅行き";

    }
}

//現在地
function currentPosition() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setZoom(18);
                currenMarker.setPosition(pos);
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


//GPS
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    var message = browserHasGeolocation
        ? "エラー: GPSの位置情報が読み込めませんでした"
        : "エラー: GPSが使えないデバイスです";
    ons.notification.toast(message, { timeout: 3000, animation: "fall" });
}




// メニューの制御
//OnsenUI初期設定
window.fn = {};
window.fn.open = function () {
    var menu = document.getElementById("menu");
    menu.open();
};
window.fn.load = function (page) {
    var content = document.getElementById("content");
    var menu = document.getElementById("menu");
    content.load(page).then(menu.close.bind(menu));
};

//アクションシートの制御
var app = {};
ons.ready(function () {
    ons.createElement("action-sheet.html", { append: true }).then(function (
        sheet
    ) {
        app.showFromTemplate = sheet.show.bind(sheet);
        app.hideFromTemplate = sheet.hide.bind(sheet);
    });
});

//メニューの表示非表示
function openMenu() {
    document.getElementById("humbrugerMenu").show();
    document.getElementById("currentPositionButton").show();
}
function closeMenu() {
    document.getElementById("humbrugerMenu").hide();
    document.getElementById("currentPositionButton").hide();
}
