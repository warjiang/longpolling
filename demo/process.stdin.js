/**
 * Created by Dell on 2015/10/30.
 */
process.stdin.on('end', function () {
    process.stdout.write('end');
});


// gets 函数的简单实现
function gets(cb) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (chunk) {
        process.stdin.pause();
        cb(chunk);
    });
}

gets(function (reuslt) {
    console.log("[" + reuslt + "]");
});