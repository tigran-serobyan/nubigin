function main() {
    var socket = io.connect('http://localhost:3000');
    var myIp;
    function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
        //compatibility for firefox and chrome
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
            noop = function () { },
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

        function iterateIP(ip) {
            if (!localIPs[ip]) onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });

            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function (reason) {
            // An error occurred, so handle the failure to connect
        });

        //listen for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }

    var input = document.getElementById('post_text');
    var button = document.getElementById('post_submit');
    var user = "tigran";
    var following;
    var posts = document.getElementById('posts');
    function appPost() {
        var val = input.value;
        if (val != "") {
            val = {
                'user': user,
                'text': val,
                'img': '290620182256a.png'
            }
            socket.emit("new post", val);
            input.value = "";
        }
    }
    button.onclick = appPost;
    function newPost(data) {
        for (var i in following) {
            if (following[i] == data.user) {

                var div = document.createElement('div');
                div.innerHTML = '<h3 class="post-text">' + data.user + '</h3><p>' + data.text + '</p>';
                posts.insertBefore(div, posts.childNodes[0]);
            }
        }

    }
    function deletE(count) {
        if (count == "all") {
            posts.innerHTML = "";
        }
    }
    function userControl(data) {
        for (var i in data[0]) {
            if (data[0][i] == user) {
                following = data[1][i];
            }

        }
    }
    function signIn(data) {
        for (var i in data) {
            if (data[i].ip == myIp) {
                user = data.user;
                socket.emit('start','start');
                // getUserIP(function (ip) {
                //     myIp = ip;
                //     socket.emit("ip", [ip, user]);
                // });
            }
        }
    }
    socket.on('new post', newPost);
    socket.on('delete', deletE);
    socket.on('users', userControl);
    socket.on('signIn', signIn);
} // main closing bracket

window.onload = main;