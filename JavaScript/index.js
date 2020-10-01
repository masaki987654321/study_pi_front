// ページが読み込まれた時に実行される関数
function init() {
    is_login()
    readRecordData()
}

// ログアウトの処理をする関数
function logout() {
    firebase.auth().signOut().then(function() {
        location.href = './login.html';
    }).catch(function(error) {
        console.log(error)
    });
};

// ログインしているか判定し、していなければログインページへ飛ばす関数
function is_login() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('userId: ' + user.uid)
        } else {
            window.location.href = 'login.html';
        }
    });
}

//ランキング順に総時間を並び替えるために配列に入れる
var object = {};
var array = [];

var dayObject = {};
var dayArray = [];

var weekObject = {};
var weekArray = [];

var monthObject = {};
var monthArray = [];

var allObject = {};
var allArray = [];

var database = firebase.database();

function readRecordData() {
    firebase.database().ref('/records/').once('value').then(function(snapshot) {

        var data = snapshot.val();

        var now = moment().format('YYYY-MM-DD');

        var i = 0;
        var j = 0;
        var users_data = data;
        //ユーザを1人1人見ていく
        for (let users_key in users_data) {
            var user_data = users_data[users_key]

            i++;

            var OneDayData = 0;
            //特定ユーザの勉強時間を取得(jsonの深い層)
            for (let user_key in user_data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(user_data[user_key]['date'], 'YYYY-MM-DD'), 'days');

                if (diff == 0) {
                    OneDayData += Number(user_data[user_key]['term'])
                }
                name = user_data[user_key].name;

            }
            //ユーザIDと総時間を連想配列に入れる(全ユーザ分)
            object = { userid: users_key, userName: name, term: OneDayData };
            array[i - 1] = object;

        }

        //総時間を基準に並び替え
        array.sort(function(a, b) {
            if (a.term > b.term) return -1;
            if (a.term < b.term) return 1;
            return 0;
        });

        //テーブルにセル付け足していく
        for (let users_key in users_data) {
            j++;

            var table = document.getElementById('targetTable');
            var newRow = table.insertRow();

            //ベスト3には王冠を表示
            if (j == 1) {
                var newCell = newRow.insertCell();
                var img1 = document.createElement("img");
                img1.src = "./img/f4-1.png";
                newCell.appendChild(img1);
            } else if (j == 2) {
                var newCell = newRow.insertCell();
                var img2 = document.createElement("img");
                img2.src = "./img/f4-2.png";
                newCell.appendChild(img2);
            } else if (j == 3) {
                var newCell = newRow.insertCell();
                var img3 = document.createElement("img");
                img3.src = "./img/f4-3.png";
                newCell.appendChild(img3);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(j);
                newCell.appendChild(newText);
            }

            var user_data = users_data[users_key];

            if (1 <= j && j <= 3) {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(array[j - 1].userName);
                newCell.appendChild(newText);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode("匿名");
                newCell.appendChild(newText);
            }

            //総時間を表示
            var newCell = newRow.insertCell();
            var newText = document.createTextNode(array[j - 1].term + "分");
            newCell.appendChild(newText);

            //ログインしているユーザのIDを取得
            const userId = firebase.auth().currentUser.uid;

            //ログインしているユーザIDと配列に入っているユーザIDが正しければrowを色付け
            if (userId == array[j - 1].userid) {
                newRow.style.backgroundColor = '#d3d3d3';
            }
        }
    });
}



function DayRecord() {
    firebase.database().ref('/records/').once('value').then(function(snapshot) {

        var data = snapshot.val()

        var now = moment().format('YYYY-MM-DD');

        var i = 0;
        var j = 0;

        var users_data = data;
        for (let users_key in users_data) {
            var user_data = users_data[users_key]

            i++;

            var OneDayData = 0;

            for (let user_key in user_data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(user_data[user_key]['date'], 'YYYY-MM-DD'), 'days');

                if (diff == 0) {
                    OneDayData += Number(user_data[user_key]['term'])
                }
                name = user_data[user_key].name;

            }

            dayObject = { userid: users_key, userName: name, term: OneDayData };
            dayArray[i - 1] = dayObject;

        }

        dayArray.sort(function(a, b) {
            if (a.term > b.term) return -1;
            if (a.term < b.term) return 1;
            return 0;
        });


        for (let users_key in users_data) {
            j++;

            var table = document.getElementById('targetTable');
            table.deleteRow(1);
            var newRow = table.insertRow();

            if (j == 1) {
                var newCell = newRow.insertCell();
                var img1 = document.createElement("img");
                img1.src = "./img/f4-1.png";
                newCell.appendChild(img1);
            } else if (j == 2) {
                var newCell = newRow.insertCell();
                var img2 = document.createElement("img");
                img2.src = "./img/f4-2.png";
                newCell.appendChild(img2);
            } else if (j == 3) {
                var newCell = newRow.insertCell();
                var img3 = document.createElement("img");
                img3.src = "./img/f4-3.png";
                newCell.appendChild(img3);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(j);
                newCell.appendChild(newText);
            }

            var user_data = users_data[users_key];

            if (1 <= j && j <= 3) {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(dayArray[j - 1].userName);
                newCell.appendChild(newText);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode("匿名");
                newCell.appendChild(newText);
            }

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(dayArray[j - 1].term + "分");
            newCell.appendChild(newText);

            const userId = firebase.auth().currentUser.uid;

            if (userId == dayArray[j - 1].userid) {
                newRow.style.backgroundColor = '#d3d3d3';
            }
        }
    });
}

function WeeklyRecord() {
    firebase.database().ref('/records/').once('value').then(function(snapshot) {

        var data = snapshot.val()

        var now = moment().format('YYYY-MM-DD');


        var i = 0;
        var j = 0;
        var users_data = data;
        for (let users_key in users_data) {
            var user_data = users_data[users_key]

            i++;

            var WeeklyDayData = 0;

            for (let user_key in user_data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(user_data[user_key]['date'], 'YYYY-MM-DD'), 'days');

                if (0 <= diff && diff <= 6) {
                    WeeklyDayData += Number(user_data[user_key]['term'])
                }
                name = user_data[user_key].name;

            }
            console.log(WeeklyDayData)

            weekObject = { userid: users_key, userName: name, term: WeeklyDayData };
            weekArray[i - 1] = weekObject;

        }

        weekArray.sort(function(a, b) {
            if (a.term > b.term) return -1;
            if (a.term < b.term) return 1;
            return 0;
        });



        for (let users_key in users_data) {
            j++;

            var table = document.getElementById('targetTable');
            table.deleteRow(1);
            var newRow = table.insertRow();

            if (j == 1) {
                var newCell = newRow.insertCell();
                var img1 = document.createElement("img");
                img1.src = "./img/f4-1.png";
                newCell.appendChild(img1);
            } else if (j == 2) {
                var newCell = newRow.insertCell();
                var img2 = document.createElement("img");
                img2.src = "./img/f4-2.png";
                newCell.appendChild(img2);
            } else if (j == 3) {
                var newCell = newRow.insertCell();
                var img3 = document.createElement("img");
                img3.src = "./img/f4-3.png";
                newCell.appendChild(img3);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(j);
                newCell.appendChild(newText);
            }

            var user_data = users_data[users_key];

            if (1 <= j && j <= 3) {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(weekArray[j - 1].userName);
                newCell.appendChild(newText);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode("匿名");
                newCell.appendChild(newText);
            }

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(weekArray[j - 1].term + "分");
            newCell.appendChild(newText);

            const userId = firebase.auth().currentUser.uid;

            if (userId == weekArray[j - 1].userid) {
                newRow.style.backgroundColor = '#d3d3d3';
            }
        }
    });
}

function MonthlyRecord() {

    firebase.database().ref('/records/').once('value').then(function(snapshot) {

        var data = snapshot.val()
        var now = moment().format('YYYY-MM-DD');

        var i = 0;
        var j = 0;
        var users_data = data;
        for (let users_key in users_data) {
            var user_data = users_data[users_key]

            i++;

            var MonthlyDayData = 0;

            for (let user_key in user_data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(user_data[user_key]['date'], 'YYYY-MM-DD'), 'months');

                if (0 <= diff && diff <= 11) {
                    MonthlyDayData += Number(user_data[user_key]['term'])
                }

                name = user_data[user_key].name;

            }

            monthObject = { userid: users_key, userName: name, term: MonthlyDayData };
            monthArray[i - 1] = monthObject;

        }

        monthArray.sort(function(a, b) {
            if (a.term > b.term) return -1;
            if (a.term < b.term) return 1;
            return 0;
        });


        for (let users_key in users_data) {
            j++;

            var table = document.getElementById('targetTable');
            table.deleteRow(1);
            var newRow = table.insertRow();

            if (j == 1) {
                var newCell = newRow.insertCell();
                var img1 = document.createElement("img");
                img1.src = "./img/f4-1.png";
                newCell.appendChild(img1);
            } else if (j == 2) {
                var newCell = newRow.insertCell();
                var img2 = document.createElement("img");
                img2.src = "./img/f4-2.png";
                newCell.appendChild(img2);
            } else if (j == 3) {
                var newCell = newRow.insertCell();
                var img3 = document.createElement("img");
                img3.src = "./img/f4-3.png";
                newCell.appendChild(img3);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(j);
                newCell.appendChild(newText);
            }

            var user_data = users_data[users_key];

            if (1 <= j && j <= 3) {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(monthArray[j - 1].userName);
                newCell.appendChild(newText);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode("匿名");
                newCell.appendChild(newText);
            }

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(monthArray[j - 1].term + "分");
            newCell.appendChild(newText);

            const userId = firebase.auth().currentUser.uid;

            if (userId == monthArray[j - 1].userid) {
                newRow.style.backgroundColor = '#d3d3d3';
            }
        }
    });

}

function AllRecord() {
    firebase.database().ref('/records/').once('value').then(function(snapshot) {

        var data = snapshot.val()
        var now = moment().format('YYYY-MM-DD');

        var i = 0;
        var j = 0;
        var users_data = data;
        for (let users_key in users_data) {
            var user_data = users_data[users_key]

            i++;

            var AllDayData = 0;

            for (let user_key in user_data) {
                var diff = moment(now, 'YYYY-MM-DD').diff(moment(user_data[user_key]['date'], 'YYYY-MM-DD'), 'days');

                if (0 <= diff) {
                    AllDayData += Number(user_data[user_key]['term'])
                }

                name = user_data[user_key].name;

            }

            allObject = { userid: users_key, userName: name, term: AllDayData };
            allArray[i - 1] = allObject;

        }
        allArray.sort(function(a, b) {
            if (a.term > b.term) return -1;
            if (a.term < b.term) return 1;
            return 0;
        });

        for (let users_key in users_data) {
            j++;

            var table = document.getElementById('targetTable');
            table.deleteRow(1);
            var newRow = table.insertRow();

            if (j == 1) {
                var newCell = newRow.insertCell();
                var img1 = document.createElement("img");
                img1.src = "./img/f4-1.png";
                newCell.appendChild(img1);
            } else if (j == 2) {
                var newCell = newRow.insertCell();
                var img2 = document.createElement("img");
                img2.src = "./img/f4-2.png";
                newCell.appendChild(img2);
            } else if (j == 3) {
                var newCell = newRow.insertCell();
                var img3 = document.createElement("img");
                img3.src = "./img/f4-3.png";
                newCell.appendChild(img3);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(j);
                newCell.appendChild(newText);
            }

            var user_data = users_data[users_key];

            if (1 <= j && j <= 3) {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode(allArray[j - 1].userName);
                newCell.appendChild(newText);
            } else {
                var newCell = newRow.insertCell();
                var newText = document.createTextNode("匿名");
                newCell.appendChild(newText);
            }

            var newCell = newRow.insertCell();
            var newText = document.createTextNode(allArray[j - 1].term + "分");
            newCell.appendChild(newText);

            const userId = firebase.auth().currentUser.uid;

            if (userId == allArray[j - 1].userid) {
                newRow.style.backgroundColor = '#d3d3d3';
            }
        }
    });
}