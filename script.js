// <!--マップの制御 -->
let map;
let infoWindow;
let currenMarker;
var selectedLatLng;
var selectedAddress;

//マップの初期化
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapId: '9664d4d621b2e362'
    });

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
        geocodeLatLng(geocoder, map, infoWindow, currenMarker);
    });

    //起動後に現在地に移動
    currentPosition();

    //吹き出し
    infoWindow = new google.maps.InfoWindow({
        // 吹き出しの追加
        content: "現在地",
    });

    // マーカー（クリック）
    var marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        draggable: true,
    });
    marker.addListener("click", function () {
        // マーカーをクリックしたとき
        selectedLatLng = marker.position;
        infoWindow.close(); // 吹き出しの表示l
        geocodeLatLng(geocoder, map, infoWindow, marker);
        app.showFromTemplate();
    });
    marker.addListener("dragend", function () {
        // マーカーをドラッグ後
        selectedLatLng = marker.position;
        geocodeLatLng(geocoder, map, infoWindow, marker);
    });

    //マップのクリックイベント
    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map, marker);
    });
    // マーカーの配置とマーカーの位置に移動
    function placeMarkerAndPanTo(latLng, map, marker) {
        marker.setPosition(latLng);
        map.panTo(latLng);
        geocodeLatLng(geocoder, map, infoWindow, marker);
        infoWindow.open(map, marker);
    }


    //マーカーのラベル
    // Create an array of alphabetical characters used to label the markers.
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    const markers = locations.map((location, i) => {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length],
        });
    });

    //クラスター
    // Add a marker clusterer to manage the markers.
    new MarkerClusterer(map, markers, {
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });

    // document.getElementById("submit").addEventListener("click", () => {
    //     geocodeLatLng(geocoder, map, infoWindow);
    // });
}

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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    var message = browserHasGeolocation
        ? "エラー: GPSの位置情報が読み込めませんでした"
        : "エラー: GPSが使えないデバイスです";
    ons.notification.toast(message, { timeout: 3000, animation: "fall" });
}




// < !--メニューの制御 -->
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
