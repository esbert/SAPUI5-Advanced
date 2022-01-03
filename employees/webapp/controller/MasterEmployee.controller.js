sap.ui.define([
    "logaligroup/employees/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Base, Filter, FilterOperator) {
        "use strict";

        // function myCheck() {
        //     var inputEmployee = this.byId("inputEmployee");
        //     var valueEmployee = inputEmployee.getValue();

        //     if (valueEmployee.length === 6) {
        //         inputEmployee.setDescription("OK");
        //     } else {
        //         inputEmployee.setDescription("Not OK");
        //     }
        //}
        function onInit() {
            
            // Atributte
            this._bus = sap.ui.getCore().getEventBus();

            //  var i18nBundle = oView.getModel("i18n").getResourceBundle();
            // var oView = this.getView();
            // var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            // oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            // oView.setModel(oJSONModelEmpl, "jsonEmployees");

            // var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            // oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            // oView.setModel(oJSONModelCountries, "jsonCountries");

            // var oJSONModelConfig = new sap.ui.model.json.JSONModel({
            //     visibleID: true,
            //     visibleName: true,
            //     visibleCountry: true,
            //     visibleCity: false,
            //     visibleBtnShowCity: true,
            //     visibleBtnHideCity: false
            // });
            // oView.setModel(oJSONModelConfig, "jsonModelConfig");

            // var oJSON = {
            //     employeeId: "12345",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //             key: "US",
            //             text: i18nBundle.getText("countryUS")
            //         },
            //         {
            //             key: "UK",
            //             text: i18nBundle.getText("countryUK")
            //         },
            //         {
            //             key: "ES",
            //             text: i18nBundle.getText("countryES")
            //         }

            //     ]
            // };
            //oJSONModel.setData(oJSON);
            // false para espera la carga del fichero 
            // verificar cuando se ha cargado correctamente
            // oJSONModel.attachRequestCompleted(function(oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()))
            // });
        };
        function onFilter() {

            var oJSONCountries = this.getView().getModel("jsonCountries").getData();

            var filters = [];
            // oJSON.EmployeeId entidad
            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            };

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey))
            };

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);

        };
        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            // este es value /EmployeeId
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKeyeId", "");

        };
        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContent = itemPressed.getBindingContext("jsonEmployees");
            var objectContent = oContent.getObject();

            sap.m.MessageToast.show(objectContent.PostalCode);
        };
        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

        };
        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        function showOrders(oEvent) {

            // Get selected Controller
            var iconPressed = oEvent.getSource();

            // Context from the model
            var oContext = iconPressed.getBindingContext("odataNorthwind");

            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            };

            // Dialog binding to the context to have access to the data of selected item
            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrders.open();

            // var ordersTable = this.getView().byId("ordersTable");

            // ordersTable.destroyItems();
            // var itemPressed = oEvent.getSource();
            // var oContext = itemPressed.getBindingContext("jsonEmployees");
            // var objectContext = oContext.getObject();
            // var orders = objectContext.Orders;

            // var ordersItems = [];
            // for (var i in orders) {
            //     ordersItems.push(new sap.m.ColumnListItem({
            //         cells: [
            //             new sap.m.Label({ text: orders[i].OrderID }),
            //             new sap.m.Label({ text: orders[i].Freight }),
            //             new sap.m.Label({ text: orders[i].ShipAddress })
            //         ]
            //     }));
            // }
            // var newTable = new sap.m.Table({
            //     width: "auto",
            //     columns: [
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
            //     ],
            //     items: ordersItems
            // }).addStyleClass("sapUiSmallMargin");
            // ordersTable.addItem(newTable);

            // var newTableJSON = new sap.m.Table();
            // newTableJSON.setWidth("auto");
            // newTableJSON.addStyleClass("sapUiSmallMargin");

            // var columOrderID = new sap.m.Column();
            // var labelOrderID = new sap.m.Label();
            // labelOrderID.bindProperty("text", "i18n>orderID");
            // columOrderID.setHeader(labelOrderID);
            // newTableJSON.addColumn(columOrderID);

            // var columFreight = new sap.m.Column();
            // var labelFreight = new sap.m.Label();
            // labelFreight.bindProperty("text", "i18n>freight");
            // columFreight.setHeader(labelFreight);
            // newTableJSON.addColumn(columFreight);

            // var columShipAddress = new sap.m.Column();
            // var labelShipAddress = new sap.m.Label();
            // labelShipAddress.bindProperty("text", "i18n>shipAddress");
            // columShipAddress.setHeader(labelShipAddress);
            // newTableJSON.addColumn(columShipAddress);

            // var columnListItem = new sap.m.ColumnListItem();
            // var cellOrderID = new sap.m.Label();
            // cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
            // columnListItem.addCell(cellOrderID);

            // var cellFreight = new sap.m.Label();
            // cellFreight.bindProperty("text", "jsonEmployees>Freight");
            // columnListItem.addCell(cellFreight);

            // var cellShipAddress = new sap.m.Label();
            // cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
            // columnListItem.addCell(cellShipAddress);

            // var oBindingInfo = {
            //     model : "jsonEmployees",
            //     path  : "Orders",
            //     template : columnListItem
            // };

            // newTableJSON.bindAggregation("items", oBindingInfo)
            // newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());
            // ordersTable.addItem(newTableJSON);
        };

        function onCloseOrders() {
            this._oDialogOrders.close();

        };

        function showEmployee(oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            // Nombre evento --> flexible nombre función  --> showEmployee
            this._bus.publish("flexible", "showEmployee", path); 

        };

        // function toOrderDetails(oEvent) {
        //     var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
        //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //     oRouter.navTo("RouteOrderDetails", {
        //         OrderID : orderID
        //     });
        // };

        var Main = Base.extend("logaligroup.employees.controller.MasterEmployee", {});
        // Main.prototype.onValidate = function () {
        //     var inputEmployee = this.byId("inputEmployee");
        //     var valueEmployee = inputEmployee.getValue();
        //     if (valueEmployee.length === 6) {
        //         this.getView().byId("labelCountry").setVisible(true);
        //         this.getView().byId("slCountry").setVisible(true);
        //     } else {
        //         this.getView().byId("labelCountry").setVisible(false);
        //         this.getView().byId("slCountry").setVisible(false);
        //     }
        // };
        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
   //     Main.prototype.toOrderDetails = toOrderDetails;

        return Main;


        // return Controller.extend("logaligroup.employees.controller.MainView", {
        //     onInit: function () {

        //     },

        //     // onValidate: myCheck
        //     onValidate: function () {
        //         var inputEmployee = this.byId("inputEmployee");
        //         var valueEmployee = inputEmployee.getValue();

        //         if (valueEmployee.length === 6) {
        //           //  inputEmployee.setDescription("OK");
        //           this.byId("labelCountry").setVisible(true);
        //           this.byId("slCountry").setVisible(true);
        //         } else {
        //           //  inputEmployee.setDescription("Not OK");
        //           this.byId("labelCountry").setVisible(false);
        //           this.byId("slCountry").setVisible(false);
        //         }
        //     }
        // });
    });
