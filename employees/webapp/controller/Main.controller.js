sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox'
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.m.MessageBox} MessageBox 
     */
    function (Controller,MessageBox) {
        'use strict';
        return Controller.extend("logaligroup.employees.controller.Main", {

            onBeforeRendering: function () {
                // detailEmployeeView es el ID de la vista llamado desde la vista Main
                this._detailEmployeeView = this.getView().byId("detailEmployeeView")
            },

            onInit: function () {
                var oView = this.getView();
                var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
                oJSONModelEmpl.loadData("./model/json/Employees.json", false);
                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                var oJSONModelCountries = new sap.ui.model.json.JSONModel();
                oJSONModelCountries.loadData("./model/json/Countries.json", false);
                oView.setModel(oJSONModelCountries, "jsonCountries");

                var oJSONModelLayout = new sap.ui.model.json.JSONModel();
                oJSONModelLayout.loadData("./model/json/Layout.json", false);
                oView.setModel(oJSONModelLayout, "jsonLayout");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonModelConfig");
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
                // this.onSaveOdataIncidence --> función al crear en el mismo controlador
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveOdataIncidence, this);

               
                this._bus.subscribe("incidence", "onDeleteIncidence", function (chanelId, eventId, data) {
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                    var filtro = "/IncidentsSet(IncidenceId='" + data.IncidenceId +
                        "',SapId='" + data.SapId +
                        "',EmployeeId='" + data.EmployeeId + "')";
                    this.getView().getModel("incidenceModel").remove(filtro, {
                            success: function () {
                                // asyc this.onReadOdataIncidence sed hace el bind 
                                this.onReadOdataIncidence.bind(this)(data.EmployeeId);
                                sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                            }.bind(this),
                            error: function (e) {
                                sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                            }.bind(this)
                        });

                }, this);

            },

            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                // Para las Incidencias
                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");

                // para limpiar el area 
                detailView.byId("tableIncidence").removeAllContent();

                this.onReadOdataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);

            },

            onSaveOdataIncidence: function (chanelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                if (typeof incidenceModel[data.rowIncidence].IncidenceId === 'undefined') {
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.rowIncidence].CreationDate,
                        Type: incidenceModel[data.rowIncidence].Type,
                        Reason: incidenceModel[data.rowIncidence].Reason
                    };

                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            // asyc this.onReadOdataIncidence sed hace el bind 
                            this.onReadOdataIncidence.bind(this)(employeeId);
                            MessageBox.success(oResourceBundle.getText("odataSaveOK"));
                            //sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    });

                } else if (incidenceModel[data.rowIncidence].CreationDateX ||
                    incidenceModel[data.rowIncidence].ReasonX ||
                    incidenceModel[data.rowIncidence].TypeX) {
                    var body = {

                        IncidenceId :incidenceModel[data.rowIncidence].IncidenceId,
                        SapId : incidenceModel[data.rowIncidence].SapId,
                        EmployeeId : incidenceModel[data.rowIncidence].EmployeeId,
                        CreationDate : incidenceModel[data.rowIncidence].CreationDate,
                        CreationDateX : incidenceModel[data.rowIncidence].CreationDateX,
                        Type : incidenceModel[data.rowIncidence].Type,
                        TypeX : incidenceModel[data.rowIncidence].TypeX,
                        Reason : incidenceModel[data.rowIncidence].Reason,
                        ReasonX : incidenceModel[data.rowIncidence].ReasonX
                    };
                    
                    //incidenceModel[data.rowIncidence].SapId
                    var filtro = "/IncidentsSet(IncidenceId='" + incidenceModel[data.rowIncidence].IncidenceId +
                        "',SapId='" + incidenceModel[data.rowIncidence].SapId +
                        "',EmployeeId='" + incidenceModel[data.rowIncidence].EmployeeId + "')";
                    this.getView().getModel("incidenceModel").update(filtro, body, {
                        success: function () {
                            // asyc this.onReadOdataIncidence sed hace el bind 
                            this.onReadOdataIncidence.bind(this)(employeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            debugger;
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                        }.bind(this)
                    });

                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                }
            },




            onReadOdataIncidence: function (employeeID) {
                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            data.results[incidence]._validateDate = true;
                            data.results[incidence].EnableSave = false;
                            var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),
                    error: function (e) {

                    }


                })

            }
        });

    });