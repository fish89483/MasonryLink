

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
    const storageRef = firebase.storage().ref('/images/');



    Vue.use(window['vue-masonry-plugin'].VueMasonryPlugin);

    let vm = new Vue({
        el: '#app',
        data: {
            categories: '',
            downloadURL: '',
            isAddArea: true,
            isEditArea: true,
        },
        firebase: {
            list: db.ref('case'),
            categories: db.ref('categories')
        },
        methods: {
            addCard(e) {
                const barColor = document.querySelector('#barColor');
                const cardTitle = document.querySelector('#cardTitle');
                const cardContent = document.querySelector('#cardContent');
                const file = document.querySelector('#cardPic').files[0];
                const fileName = Math.floor(Date.now() / 1000) + `_${file.name}`;
                const metadata = {
                    contentType: 'image/*'
                };
                const uploadTask = storageRef.child(fileName).put(file, metadata);

                // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function () {
                //     storageRef.child(fileName).getDownloadURL().then(snapshot => {
                //         db.ref('case').push({
                //             bar: barColor.value,
                //             title: cardTitle.value,
                //             text: cardContent.value,
                //             pic: snapshot,
                //         })
                //     })
                // })
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function () {
                    storageRef.child(fileName).getDownloadURL().then(snapshot => {
                        db.ref('case').push({
                            bar: barColor.value,
                            title: cardTitle.value,
                            text: cardContent.value,
                            pic: snapshot,
                        })
                    })
                })

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
                db.ref('case').child(card['.key']).remove();
                storageRef.child(card['.key'+1]).delete();
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
