var $j = jQuery.noConflict();

$j(document).ready(function () {
    var domain = "0aqf68wn39.scalacube.pro";
    var id = "#playvds-widget-0aqf68wn39-scalacube-pro-widget";
    var url = "http://" + domain + "/playvds-widget/widget";
    var api = url + "/index.php";
    var main = $j(id).last();
    var loadingMessage = "<div class='playvds-loading'>Loading...</div>";
    var errorMessage = "<div class='playvds-error'>The server is not installed</div>";
    var widget;
    var popup = null;
    var popupContent = null;

    function send(method, callback, errorCallback) {
        var error = function () {
            if (errorCallback)
                errorCallback({error: "internal"});
        };

        $j.ajax(api + "/" + (method || "")).done(function (content) {
            if (content.response != undefined) {
                if (callback)
                    callback(content.response);
            } else if (content.error != undefined) {
                if (errorCallback)
                    errorCallback(content.error);
            } else
                error();
        }).fail(error);
    }

    function openPage(name) {
        if (!popup) {
            popup = $j(
                "<div class='playvds-popup'>" +
                "<div class='playvds-popup-content'>" +
                "</div>" +
                "</div>"
            ).appendTo(main);
            popupContent = popup.find(".playvds-popup-content");

            main.find(".playvds-popup").click(function (event) {
                if (event.target.className == "playvds-popup")
                    hidePopup();
            });
        }
        popup.show();
        loadPage(popupContent, name);
    }

    function hidePopup() {
        if (!popup)
            return;

        popup.hide();
    }

    function loadPage(element, name, widget) {
        element.html(loadingMessage);
        send(name + "/info", function (info) {
            if (info.type == "static") {
                send(name, function (content) {
                    setPageContent(element, info, content, widget);

                    $j("#playvds-widget-0aqf68wn39-scalacube-pro-widget").append("<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css\">");

                    if ($j("#playvds-widget-0aqf68wn39-scalacube-pro-widget #playvds-version-site").last().hasClass("online")) {
                        var str = $j("#playvds-widget-0aqf68wn39-scalacube-pro-widget .playvds-page  p").last().text();
                        str = str.substring(str.indexOf(':') + 2);
                        str = str.trim();
                        mas = str.split("/");
                        procen = 100 / mas[1] * mas[0];
                        ll = 100 - procen
                        contn = '<div class=\"playvds-monitor\"><div class=\"playvds-monitor-inside\" style=\"height:' + ll + '%\"></div></div>'
                        $j("#playvds-widget-0aqf68wn39-scalacube-pro-widget .playvds-page p").last().remove();
                        setTable('green', "server online|" + mas[0] + "/" + mas[1], info.title, contn);
                        $j("#playvds-widget-0aqf68wn39-scalacube-pro-widget .playvds-status").last().addClass("fa fa-check-circle green");


                    } else {
                        setTable('red', "server Offline", info.title, "");
                        $j("#playvds-widget-0aqf68wn39-scalacube-pro-widget .playvds-status").addClass("fa fa-times-circle red")
                    }
                });
            }
        }, function (error) {
            element.html(errorMessage);
        });
    }

    function setTable(colorfont, text, title, contn) {
        $j("#playvds-widget-0aqf68wn39-scalacube-pro-widget .playvds-page p").last()
            .append("<table class=\"plavds-widget-info\">" +
                "<tbody><tr>" +
                "<td width=\"50px\">" +
                "<i class=\"playvds-status\"></i>" +
                "</td> <td>" + "<div>" + title + "</div>" +
                "<div><div class=\"playvds-info " + colorfont + "\">" + text + "</div></div>" +
                "<div></div>" + "</td></tr> </tbody></table>" + contn
            );
    }

    function setPageContent(element, info, content, widget) {
        element.html(
            "<div class='playvds-page'>" +
            content +
            "</div>"
        );
        element.find(".playvds-open-page").click(function (e) {
            e.preventDefault();
            openPage($j(this).attr("data-page"));
        });
        element.find(".playvds-close").click(hidePopup);
    }

    $j("head").append($j(
        "<link rel='stylesheet' href='" + url + "/style.css' type='text/css' media='screen' />"
    ));

    widget = $j("<div/>").appendTo(main);
    loadPage(widget, "widget", true);
});
