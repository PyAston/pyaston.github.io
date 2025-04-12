// 有关“拆分”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: 此应用程序刚刚启动。在此处初始化
                //您的应用程序。
                WinJS.Application.onsettings = function (e) {
                    e.detail.applicationcommands = {
                    }
                    WinJS.UI.SettingsFlyout.populateSettings(e);
                    var applicationCommandsVector = e.detail.e.request.applicationCommands;
                    applicationCommandsVector.append(new Windows.UI.ApplicationSettings.SettingsCommand(
                        "privacy",
                        "隐私声明",
                        function () {
                            window.open('http://malash.me/project/ali/privacy.html');
                        }
                    ));
                };
            } else {
                // TODO: 此应用程序已从挂起状态重新激活。
                // 在此处恢复应用程序状态。
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: 即将挂起此应用程序。在此处保存
        //需要持续挂起的任何状态。如果您需要
        //在应用程序挂起之前完成异步操作
        //，请调用 args.setPromise()。
        app.sessionState.history = nav.history;
    };

    app.start();
})();
