let last_saved_time = new Date();

const reset_last_modified = (time) => {
    let msg = "Last saved: ";
    if (time) {
        msg += time;
    } else {
        msg += "never";
    }
    document.getElementById("timestamp").innerHTML = msg;
}

const get_stored_content = () => {
    last_modified = window.localStorage['timestamp'];
    saved_content = window.localStorage['content'];
    reset_last_modified(last_modified);
    if (last_modified) {
        document.getElementById("content").innerHTML = saved_content;
    }
};

const save_content = (e) => {
    last_saved_time = new Date();
    window.localStorage['timestamp'] = last_saved_time.toLocaleString('en-gb');
    window.localStorage['content'] = document.getElementById("content").innerHTML;
    reset_last_modified(last_saved_time.toLocaleString('en-gb'));
};

const set_edited_flag = () => {
    timestamp_p = document.getElementById("timestamp");
    if (timestamp_p.innerHTML.slice(-1) != "✎") {
        timestamp_p.innerHTML += " ✎";
    }
}

// load previous content when the page loads up
window.onload = () => {
    get_stored_content();
};

// Add event listener to save page content regularly
document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {
        // capture ctrl-s keystroke and map it to save content instead on browser default
        save_content(e);
        e.preventDefault();
        return false;
    }
}, false);

document.getElementById("content").addEventListener("input", function() {
    set_edited_flag();
}, false);