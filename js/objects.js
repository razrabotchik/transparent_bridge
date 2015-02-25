;
/**
 * @author Golubovsky Alexey
 */

/**
 * Конструктор для клиентов
 * @param {String} MAC
 * @param {Number} Number
 * @param {Number} Port
 * @constructor
 */
var Client = function (MAC, Number, Port) {
    this.MAC = MAC;
    this.Number = Number;
    this.Title = Number + 1;
    this.Port = Port;
};

/**
 * Конструктор для запросов таблицы марштутизации
 * @param {String} MAC
 * @param {Number} Port
 * @constructor
 */
var RoutingTableRecord = function (MAC, Port) {
    this.MAC = MAC;
    this.Port = Port;
};

/**
 * Класс что представляет собой мост
 * @constructor
 */
var BridgeClass = function () {
    var _items = [];

    /**
     * @param {RoutingTableRecord} item
     */
    this.add = function (item) {
        if (item instanceof RoutingTableRecord) {
            _items.push(item);
        } else {
            throw new Error('Invalid item type');
        }
    };

    /**
     * @returns {Array}
     */
    this.items = function() {
        return _items;
    };

    /**
     * @returns {Number}
     */
    this.length = function() {
        return _items.length;
    };

    /**
     * @param {String} MAC
     * @returns RoutingTableRecord
     */
    this.getByMAC = function(MAC) {
        var itemsLength = _items.length;

        if (itemsLength) {
            for (var i=0; i<itemsLength; i++) {
                if (_items[i].MAC == MAC) {
                    return _items[i];
                }
            }
        }

        return null;
    };
};

/**
 * Логирование
 * @param $scope
 * @constructor
 */
var Log = function ($scope) {
    var _items = [];

    var _push = function (line) {
        _items.unshift(_getTime() + " " + line);
        $scope.log = _items;
    };

    var _getTime = function () {
        var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
        return (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes)
            + ":" + (seconds < 10 ? '0' + seconds : seconds);
    };

    this.push = function (line) {
        _push(line);
    };

    this.logSend = function (Sender, Receiver) {
        _push('Отправка пакет от клиента ' + Sender + ' клиенту ' + Receiver);
    };

    this.logPackageReceive = function (clientTitle) {
        _push('Клиент ' + clientTitle + ' получил пакет.');
    };

    this.clientExistsByMAC = function(client) {
        _push('Клиент с адресом ' + client.MAC + ' есть в таблице маршрутизации.');
    };

    this.clientNotExistsByMAC = function(client) {
        _push('Клиент с адресом ' + client.MAC + ' отсутствует в таблице маршрутизации.');
    };

    this.clientAddedInRoutingTable = function(client) {
        _push('Клиент с адресом ' + client.MAC + ' добавлен в таблицу маршрутизации.');
    };

    this.clientOnPort = function(client) {
        _push('Клиент ' + client.Title + ' находится на порту ' + client.Port);
    }
};