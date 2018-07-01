function main() {
    var socket = io.connect('http://localhost:3000');
    var input = document.getElementById('post_text');
    var button = document.getElementById('post_submit');
    var user = "areg";
    var following = ['tigran','areg','vanuhi'];
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
        for(var i in following){
            if(following[i] == data.user){
                             
                var div = document.createElement('div');
                div.innerHTML = '<h3 class="post-text">'+data.user+'</h3><p>'+data.text+'</p>';
               posts.insertBefore(div, posts.childNodes[0]);
            }
        }
        
    }
    function deletE(count){
        if(count == "all"){
        posts.innerHTML = "";
        }
    }
    socket.on('new post', newPost);
    socket.on('delete', deletE);
} // main closing bracket

window.onload = main;