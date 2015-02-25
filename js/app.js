/**
 * @author Golubovsky Alexey
 */
;
var app = angular.module('app', []);

app.controller('main', ['$scope', '$timeout', function ($scope, $timeout) {
    var _log = new Log($scope),
        _bridgeInstance = new BridgeClass();

    $scope.log = [];
    $scope.routing_table_storage = [];

    /* клиенты */
    $scope.clients = [];
    $scope.client_1 = false;
    $scope.client_2 = false;

    $scope.FormCreate = function () {
        $scope.clients.push(new Client('2E-A4-33-B2-CD-7D', 0, 1));
        $scope.clients.push(new Client('94-0C-6D-CA-5D-5A', 1, 1));
        $scope.clients.push(new Client('D0-DF-9A-BC-D3-76', 2, 1));
        $scope.clients.push(new Client('90-C1-15-71-87-8B', 3, 1));
        $scope.clients.push(new Client('3E-A4-33-B2-CD-7D', 4, 1));
        $scope.clients.push(new Client('14-9C-6D-CA-5D-5A', 5, 2));
        $scope.clients.push(new Client('D6-DF-9A-BC-D3-76', 6, 2));
        $scope.clients.push(new Client('91-C1-15-71-87-8B', 7, 2));
        $scope.clients.push(new Client('2A-14-33-B2-CD-7D', 8, 2));
        $scope.clients.push(new Client('14-A4-33-B2-CD-7D', 9, 2));

        _log.push('Начало работы');

        $scope.client_1 = $scope.clients[0];
        $scope.client_2 = $scope.clients[0];
    };

    /** общие параметры */
    $scope.page = 'home';

    /** парметры формы */
    $scope.packet_types = {
        1: 'Целевой',
        2: 'Общий'
    };
    $scope.packet_type = 1;
    $scope.selectPacket = function (packetType) {
        if (packetType == 2) {
            $scope.client_2 = false;
        } else {
            $scope.client_2 = $scope.clients[0];
        }
        $scope.packet_type = packetType;
    };

    /* служебные данные */
    $scope.is_loading = false;
    $scope.current_line_mark = 0;

    /** отметка линии активной - анимация */
    var _setLineAsActive = function (client) {
        var iteration = 0,
            eventFunction = function () {
                if ((iteration / 2) === Math.round(iteration / 2)) {
                    $scope.current_line_mark = 0;
                } else {
                    $scope.current_line_mark = client;
                }

                iteration++;
                if (iteration < 5) {
                    $timeout(eventFunction, 300)
                }
            };

        eventFunction();
    };

    // ф-ция проверки существования получателя в таблице маршрутизации
    var _checkIsReceiverInTable = function (client) {
        var founded = false;

        if (_bridgeInstance.length() > 0) {
            founded = _bridgeInstance.getByMAC(client.MAC);
            if (founded) {
                _log.clientExistsByMAC(client);
            }
        } else {
            _log.push('Таблица маршрутизации пуста');
        }

        if (!founded) {
            _log.clientNotExistsByMAC(client);

            _bridgeInstance.add(new RoutingTableRecord(client.MAC, client.Port));

            _log.clientAddedInRoutingTable(client);
            _log.clientOnPort(client);

            $scope.routing_table_storage = _bridgeInstance.items();
        }
    };

    // ф-ция проверки существования отправителя в таблице маршрутизации
    var _checkIsSenderInTable = function (client) {
        var founded = false;

        if (_bridgeInstance.length() > 0) {
            founded = _bridgeInstance.getByMAC(client.MAC);
            if (founded) {
                _log.clientExistsByMAC(client);
            }
        } else {
            _log.push('Таблица маршрутизации пуста');
        }

        if (!founded) {
            _log.clientNotExistsByMAC(client);

            _bridgeInstance.add(new RoutingTableRecord(client.MAC, client.Port));

            _log.clientAddedInRoutingTable(client);
            _log.clientOnPort(client);

            $scope.routing_table_storage = _bridgeInstance.items();
        }
    };

    $scope.sendPacket = function () {
        // визначення індексу відправника
        var clientSender = $scope.client_1,
            clientReceiver = $scope.client_2;

        // якщо це не загальний пакет, то визначаємо адресата
        if ($scope.packet_type == 1) {
            _log.logSend(clientSender.Title, clientReceiver.Title);

            if (clientSender.Number >= 0 && clientReceiver.Number >= 0) {
                if (clientSender == clientReceiver) {
                    _log.push('Отправитель и получатель совпадают.');
                }

                // проверка существования адресата
                _checkIsSenderInTable(clientSender);

                // проверка существования получателя
                _checkIsReceiverInTable(clientReceiver);

                if (clientSender.Number >= 0 && clientSender.Number <= 9) {
                    // анимация для отправителя
                    _setLineAsActive(clientSender.Title);
                }

                if (clientReceiver.Number >= 0 && clientReceiver.Number <= 9) {
                    // анимация для адресата
                    _setLineAsActive(clientReceiver.Title);
                    // регистрация получения пакета
                    _log.logPackageReceive(clientReceiver.Title);
                }
            }
        } else {
            // регистрация получения общего пакета
            _log.push('Отправка широковещательного пакета');
            var clientsLength = $scope.clients.length;

            for (var i = 0; i<clientsLength; i++) {
                if (i != clientSender.Number) {
                    _log.logPackageReceive($scope.clients[i].Title);
                }
            }
        }
    };

    /** выпажающие списки клиентов */
    $scope.client1_toggle_val = false;
    $scope.client2_toggle_val = false;

    $scope.client1_toggle = function () {
        $scope.client1_toggle_val = !$scope.client1_toggle_val;
    };

    $scope.client2_toggle = function () {
        $scope.client2_toggle_val = !$scope.client2_toggle_val;
    };

    $scope.selectClient1 = function (client) {
        $scope.client_1 = client;
        $scope.client1_toggle();
    };

    $scope.selectClient2 = function (client) {
        $scope.client_2 = client;
        $scope.client2_toggle();
    };

}
])
;