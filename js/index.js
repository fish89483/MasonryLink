// explicit installation required in module environments
Vue.use(VueFire)

// Initialize Firebase
let config = {
    apiKey: "AIzaSyCeAMQX4JdKTkpXO4aZ2p63OKTpssqmqqI",
    authDomain: "masonrylink.firebaseapp.com",
    databaseURL: "https://masonrylink.firebaseio.com",
    projectId: "masonrylink",
    storageBucket: "masonrylink.appspot.com",
    messagingSenderId: "1049376582100"
};
firebase.initializeApp(config);

const db = firebase.database();
let storageRef = firebase.storage().ref();



Vue.use(window['vue-masonry-plugin'].VueMasonryPlugin);

let vm = new Vue({
    el: '#app',
    data: {
        categories: '',
        downloadURL: '',
        isAddArea: true,
        isEditArea: true,
        showFileName: '',
    },
    firebase: {
        list: db.ref('case'),
        categories: db.ref('categories')
    },
    methods: {
        onFileChange(e) {
            let files = e.target.files || e.dataTransfer.files;
            let showFileName = ""
            this.showFileName = files[0].name;
           


        },
        addCard(e) {
            let barColor = document.querySelector('#barColor');
            let cardTitle = document.querySelector('#cardTitle');
            let cardContent = document.querySelector('#cardContent');
            let file = document.querySelector('#cardPic').files[0];
            console.log(file);
            // 確認有無上傳圖片
            if (file) {
                let fileName = Math.floor(Date.now() / 1000) + `_${file.name}`;
                console.log(fileName);
                let uploadTask = storageRef.child('/images/' + fileName).put(file);
                console.log(uploadTask)

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function () {
                    console.log("ADD successful")
                    storageRef.child('/images/' + fileName).getDownloadURL().then(snapshot => {
                        console.log("snshot " + snapshot);
                        db.ref('case').push({
                            bar: barColor.value,
                            title: cardTitle.value,
                            text: cardContent.value,
                            pic: snapshot,
                            picName: '/images/' + fileName
                        })
                    })

                }, function (error) {
                    console.log("ADD error")
                })
            } else {
                alert("你無上傳圖檔")
            }
            // uploadTask.put(file, metadata)

            // uploadTask;


            // function upLoadImg(cardPic) {
            //     // 取得上傳檔案的資料
            //      const file = cardPic;
            //     console.log(file);
            //     const fileName = Math.floor(Date.now() / 1000) + `_${file.name}`;
            //     const metadata = {
            //         contentType: 'image/*'
            //     };
            //     const uploadTask = storageRef.child(fileName).put(file, metadata);
            //     console.log(uploadTask)

            //     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function() {
            //         uploadTask.getDownloadURL().then(snapshot => {
            //             this.downloadURL = snapshot
            //         })
            //     })

            //     downloadURL = uploadTask.getDownloadURL().then(snapshot => {
            //         this.downloadURL = snapshot
            //     });
            // }
        },
        removeCard(card) {
            console.log(card)
            console.log(card['.key'])
            console.log(card['.key'].picName)

            storageRef.child(card['picName']).delete().then(function () {
                console.log('DEL successfull')
            }).catch(function (error) {
                console.log('DEL error')
            });
            db.ref('case').child(card['.key']).remove();
            setTimeout(function () {
                vm.$redrawVueMasonry()
            }, 300);


        },
        editCard(card) {

        }
        // addArea(){
        //     this.isAddArea = true
        // }

    },

    // created() {
    //     db.ref('case').on('value').then(snapshot => {
    //         const value = snapshot.val()
    //         this.list = value
    //     })
    // }
})

function autogrow(textarea) {
    var adjustedHeight = textarea.clientHeight;

    adjustedHeight = Math.max(textarea.scrollHeight, adjustedHeight);
    if (adjustedHeight > textarea.clientHeight) {
        textarea.style.height = adjustedHeight + 'px';
    }

}