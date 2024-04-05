module.exports = function paginationAll(codan, pageActive, totalPage) {
    var html = '';
    pageActive = parseInt(pageActive);
    for (i = 1; i <= codan; i++) {
        if (pageActive - i <= 0) break;
        html = '<li class="page-item"><a class="page-link" href="?page=' + (pageActive - i) + '">' + (pageActive - i) + '</a></li>' + html;
    }
    html += '<li class="page-item"><a class="page-link" style="background-color: #5cb85c"  href="?page=' + pageActive + '">' + (pageActive) + '</a></li>';
    for (i = 1; i <= codan; i++) {
        if (pageActive + i >= totalPage) break;
        html = html + '<li class="page-item"><a class="page-link" href="?page=' + (pageActive + i) + '">' + (pageActive + i) + '</a></li>';
    }
    if (pageActive + 1 <= totalPage) {
        return ('<li class="page-item"><a class="page-link" href="?page=' + (pageActive - 1) + '">Previous</a></li>' + html + '<li class="page-item"><a class="page-link" href="?page=' + (pageActive + 1) + '">Next</a></li> ');
    } else {
        return ('<li class="page-item"><a class="page-link" href="?page=' + (pageActive - 1) + '">Previous</a></li>' + html + '');
    }
}