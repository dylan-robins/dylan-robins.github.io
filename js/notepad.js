let selected_tab = null;

const select_tab = (tab_list, tab_to_select, nosave=false) => {
    if (!nosave) {
        // save content on current tab
        save_content();
    }

    // change selected tab
    for (const other_tab of tab_list) {
        other_tab.classList.remove("selected");
    }
    tab_to_select.classList.add("selected");
    
    selected_tab = tab_to_select;

    // load content of new selected tab
    get_stored_content();
};

const reset_last_modified = (time) => {
    let msg = "Last saved: ";
    if (time) {
        msg += time;
    } else {
        msg += "never";
    }
    document.getElementById("timestamp").innerHTML = msg;
};

const get_stored_content = () => {
    if (window.localStorage.getItem('content_' + selected_tab.innerText) === null) {
        // Tab didn't previously exist. Load empty text area
        document.getElementById("content").innerHTML = "";
    } else {
        // Tab exists. Load content from local storage
        last_modified = window.localStorage['timestamp'];
        saved_content = window.localStorage['content_' + selected_tab.innerText];
        reset_last_modified(last_modified);
        if (last_modified) {
            document.getElementById("content").innerHTML = saved_content;
        }
    }
};

const save_content = (e) => {
    last_saved_time = new Date();
    window.localStorage['timestamp'] = last_saved_time.toLocaleString('en-gb');
    // don't save empty divs
    html = document.getElementById("content").innerHTML
    if (html != "<div></div>" && html != "<br>") {
        window.localStorage['content_' + selected_tab.innerText] = html;
    } else {
        window.localStorage['content_' + selected_tab.innerText] = "";
    }
    reset_last_modified(last_saved_time.toLocaleString('en-gb'));
};

const set_edited_flag = () => {
    timestamp_p = document.getElementById("timestamp");
    if (timestamp_p.innerHTML.slice(-1) != "✎") {
        timestamp_p.innerHTML += " ✎";
    }
}

// Add event listener to save page content regularly
document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {
        // capture ctrl-s keystroke and map it to save content instead on browser default
        save_content(e);
        e.preventDefault();
        return false;
    } else if (e.keyCode === 13) {
        // save on every newline
        save_content(e);
    }

    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.key !== "Escape") {
        content_node = document.getElementById("content");
        if (content_node.innerHTML == "" || content_node.innerHTML == "<br>") {
            content_node.innerHTML = "<div></div>";
        }
    }
}, false);

document.getElementById("content").addEventListener("input", function() {
    set_edited_flag();
}, false);


// load previous content when the page loads up
window.onload = () => {
    // FOR LEGACY SUPPORT
    // Update old localStorage key to new ones
    if (
        window.localStorage.getItem('content') !== null
        && window.localStorage.getItem('content_1') === null
    ) {
        console.warn("Updating old localStorage key to new naming convention");
        window.localStorage['content_1'] = window.localStorage['content'];
    }

    // add event listeners to each tab on the page
    const tabs = document.getElementsByClassName("button");
    for (const tab of tabs) {
        tab.addEventListener("click", () => {
            select_tab(tabs, tab);
        });
    }
    // select first tab
    selected_tab = tabs[0];
    select_tab(tabs, tabs[0], nosave=true);
};