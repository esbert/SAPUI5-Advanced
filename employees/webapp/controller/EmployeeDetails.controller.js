sap.ui.define([
    "logaligroup/employees/controller/Base.controller",
    'logaligroup/employees/model/formatter',
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.m.MessageBox} MessageBox 
     */
    function (Base, formatter, MessageBox) {
        'use strict';


        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onCreateIncidence() {
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length;
            //            odata.push({ index : index + 1});
            odata.push({ index: index + 1, _validateDate: false, EnableSave: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);

        };

        function onDeleteIncidence(oEvent) {
            var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

            MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        this._bus.publish("incidence", "onDeleteIncidence", {
                            IncidenceId: contextObj.IncidenceId,
                            SapId: contextObj.SapId,
                            EmployeeId: contextObj.EmployeeId
                        });
                    }
                }.bind(this)
            });


            //     var tableIncidence = this.getView().byId("tableIncidence");
            //     var rowIncidence = oEvent.getSource().getParent().getParent();
            //     var incidenceModel = this.getView().getModel("incidenceModel");
            //     var odata = incidenceModel.getData();
            //     var contextObj = rowIncidence.getBindingContext("incidenceModel").getObject();

            //     odata.splice(contextObj.index-1,1);
            //     for (var i in odata) {
            //         odata[i].index = parseInt(i) + 1;
            //     };
            //    incidenceModel.refresh();
            //    // lo que hay que eliminar
            //    tableIncidence.removeContent(rowIncidence);
            //    // luego lo actualizamos con el Binding
            //    for (var j in tableIncidence.getContent()) {
            //        tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
            //    };
        };

        function onSaveIncidence(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var rowIncidence = incidence.getBindingContext("incidenceModel");
            this._bus.publish("incidence", "onSaveIncidence", { rowIncidence: rowIncidence.sPath.replace('/', '') });

        };

        function updateIncidenceCreationDate(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            if (!oEvent.getSource().isValidValue()) {
                contextObj._validateDate = false;
                contextObj.CreationDateState = "Error";
                MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                    title: "Error",
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            } else {
                contextObj.CreationDateX = true;
                contextObj._validateDate = true;
                contextObj.CreationDateState = "None"
            };
            if (oEvent.getSource().isValidValue() && contextObj.Reason) {
                contextObj.EnableSave = true;
            } else {
                contextObj.EnableSave = false;
            };
            context.getModel().refresh();
        };
        
        function updateIncidenceReason(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();
            if (oEvent.getSource().getValue()) {
                contextObj.ReasonX = true;
                contextObj.ReasonState = "None"

            } else {
                contextObj.ReasonState = "Error"
            };
            if (contextObj._validateDate && oEvent.getSource().getValue()) {
                contextObj.EnableSave = true;
            } else {
                contextObj.EnableSave = false;
            };
            context.getModel().refresh();


        };
        function updateIncidenceType(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();
            if (contextObj._validateDate && contextObj.Reason) {
                contextObj.EnableSave = true;
            } else {
                contextObj.EnableSave = false;
            };
            contextObj.TypeX = true;
            context.getModel().refresh();
        };

        // function toOrderDetails(oEvent) {
        //     var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
        //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //     oRouter.navTo("RouteOrderDetails", {
        //         OrderID: orderID
        //     });
        // };

        var EmployeeDetails = Base.extend("logaligroup.employees.controller.EmployeeDetails", {});
        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
        EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
        EmployeeDetails.prototype.Formatter = formatter;
        EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
        EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
        EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
        EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;
        //        EmployeeDetails.prototype.toOrderDetails = toOrderDetails;
        return EmployeeDetails;

    });