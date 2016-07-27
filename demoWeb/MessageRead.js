/// <reference path="/Scripts/FabricUI/MessageBanner.js" />

$(function () {
    "use strict";

    var GITHUB_ENDPOINT = "https://api.github.com/";
    var STATISTICS_ENDPOINT = "https://pythonserver:1234/api/"

    var messageBanner;
    var item;
    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        item = Office.context.mailbox.item;
        $(document).ready(function () {
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();
        });
    };

    $("#repo-name-form").submit(function (e) {
        e.preventDefault();

        var repo_name = $("#repo-name-form input").val();

        $.get(GITHUB_ENDPOINT + "repos/" + repo_name, function () {
            console.log('found');
        }).fail(function () {
            console.log('no such repo');
        });

        $.get(STATISTICS_ENDPOINT + repo_name + "/stats-commit_activity", function (data) {
            console.log(data);
            console.log(data.weeks.slice(data.weeks.length - 8));
            var myChart = echarts.init(document.getElementById('main'));

            var option = {
                title: {
                    text: 'Commit Stats'
                },
                xAxis: {
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
                },
                yAxis: {},
                series: [{
                    name: 'commit conuts',
                    type: 'bar',
                    data: data.weeks.slice(data.weeks.length - 12)
                }]
            };

            myChart.setOption(option);
            window.myChart = myChart;

            item.body.setSelectedDataAsync('<h2>Hello</h2>', { coercionType: Office.CoercionType.Html }, function () { });

            Office.context.mailbox.item.addFileAttachmentAsync(
                "http://smartbuildings.unh.edu/wp-content/uploads/2015/06/Winter-Tiger-Wild-Cat-Images-1024x576.jpg",
                "Winter-Tiger-Wild-Cat-Images-1024x576.jpg",
                { asyncContext: null },
                function (asyncResult) {
                    if (asyncResult.status == "failed") {
                        //showMessage("Action failed with error: " + asyncResult.error.message);
                    }
                    else {
                        Office.context.mailbox.item.body.setSelectedDataAsync(
                            "<img src='cid:Winter-Tiger-Wild-Cat-Images-1024x576.jpg'>",
                            {
                                coercionType: Office.CoercionType.Html,
                                asyncContext: { var3: 1, var4: 2 }
                            },
                            function (asyncResult) {
                                if (asyncResult.status ==
                                    Office.AsyncResultStatus.Failed) {
                                    showMessage(asyncResult.error.message);
                                }
                                else {
                                    // Successfully set data in item body.
                                    // Do whatever appropriate for your scenario,
                                    // using the arguments var3 and var4 as applicable.
                                }
                            }
                        );
                    }
                }
            );
        });
    });

    function insertImg(event) {
        event.preventDefault;
        setItemBody("https://assets-cdn.github.com/images/modules/open_graph/github-mark.png");
    }

    function GetInfo(event) {
        event.preventDefault();
        var $result = $('#image');
        $result.empty();
        var resultHtml = '<div class="results ms-u-fadeIn400" id="results"><img class="result-gif" src= "Images/download.png"/>';
        resultHtml += '<div class="button-holder"><button id="insert-img" class="ms-Button ms-Button--command"><span class="ms-Button-icon"><i class="ms-Icon ms-Icon--picture"></i></span> Insert img</button>';
        $result.append(resultHtml);
    }
    function setItemBody(url) {
        item.body.getTypeAsync(
          function (result) {
              if (result.status === Office.AsyncResultStatus.Failed) {
                  console.error(result.error.message);
              } else {
                  // If the item type is HTML and user clicked "Insert GIF", add an
                  // img element with the url as the source.
                  if (result.value === Office.MailboxEnums.BodyType.Html) {
                      // Body is of HTML type.
                      // Specify HTML in the coercionType parameter of setSelectedDataAsync.
                      item.body.setSelectedDataAsync(
                        '<img src="' + url + '" style="height: 200px;"></img>',
                        {
                            coercionType: Office.CoercionType.Html,
                            asyncContext: { var3: 1, var4: 2 }
                        },
                        function (asyncResult) {
                            if (asyncResult.status ===
                              Office.AsyncResultStatus.Failed) {
                                console.error(asyncResult.error.message);
                            } else {
                                // Successfully set data in item body.
                            }
                        });
                      // If the item type is HTML and user clicked "Insert link", add an
                      // anchor element with the url as the source.
                      // If the item type is text, just add the URL directly.
                  } else {
                      // Body is of text type.
                      item.body.setSelectedDataAsync(
                        url,
                        {
                            coercionType: Office.CoercionType.Text,
                            asyncContext: { var3: 1, var4: 2 }
                        },
                        function (asyncResult) {
                            if (asyncResult.status ===
                              Office.AsyncResultStatus.Failed) {
                                console.error(asyncResult.error.message);
                            } else {
                                // Successfully set data in item body.
                            }
                        });
                  }
              }
          });
    }



    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notificationHeader").text(header);
        $("#notificationBody").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
});
