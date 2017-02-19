sap.ui.jsview("iotapp.view.DHT22", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf iot_ui5_01.DHT22
	*/ 
	getControllerName : function() {
		return "iotapp.controller.DHT22";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf iot_ui5_01.DHT22
	*/ 
	createContent : function(oController) {
		//Insert oData Model Here
		//var oModel = new sap.ui.model.odata.ODataModel("/pkg_iot/iot_01/Services/SensorUI.xsodata",false);
		var oModel = new sap.ui.model.odata.ODataModel("/destinations/hcp_backend/pkg_iot/iot_01/Services/DHT22CA.xsodata",false);
		var oTable = new sap.ui.table.Table({
			//title: "Sensor DHT22",
			visibleRowCount: 10,
			width: '100%',
			selectionMode: sap.ui.table.SelectionMode.Single,
			//navigationMode: sap.ui.table.NavigationMode.Paginator
		});

		//Create a panel instance
//		var oPanel = new sap.ui.commons.Panel({width: "1000px", showCollapseIcon: false});
		var oPanel = new sap.ui.commons.Panel({width: '100%', showCollapseIcon: true});
		oPanel.setTitle(new sap.ui.core.Title({text: "IoT Overview"}));

		var oPanel_T = new sap.ui.commons.Panel({width: '45%', showCollapseIcon: true});
		oPanel_T.setTitle(new sap.ui.core.Title({text: "Real Time Data"}));

		var oPanel_C = new sap.ui.commons.Panel("panelid",{width: '45%', showCollapseIcon: true});
		oPanel_C.setTitle(new sap.ui.core.Title({text: "Charts"}));
		oPanel_C.addStyleClass('class_PanelC');

		var oPanel_M = new sap.ui.commons.Panel({width: '100%', showCollapseIcon: true});		
		oPanel_M.setTitle(new sap.ui.core.Title({text: "Google Map"}));
		
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"SensorID"}),
			template: new sap.ui.commons.TextView().bindProperty("text","SensorID"),
			width: "100px",
			sortProperty: "SensorID",
			filterProperty: "SensorID"
		}));
		
//		oTable.addColumn(new sap.ui.table.Column({
//			label: new sap.ui.commons.Label({text:"time_stamp"}),
//			template: new sap.ui.commons.TextView().bindProperty("text","time_stamp"),
//			width: "350px",
//			sortProperty: "time_stamp",
//			filterProperty: "time_stamp"
//		}));

		oTable.addColumn(new sap.ui.table.Column({
		label: new sap.ui.commons.Label({text:"Date"}),
		template: new sap.ui.commons.TextView().bindProperty("text","Date"),
		width: "120px",
		sortProperty: "Date",
		filterProperty: "Date"
	}));		

		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"Time"}),
			template: new sap.ui.commons.TextView().bindProperty("text","Time"),
			width: "120px",
			sortProperty: "Time",
			filterProperty: "Time"
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"humidity"}),
			//template: new sap.ui.commons.TextView().bindProperty("text","humidity"),
            template: new sap.ui.commons.TextView().bindProperty("text","humidity", function(cellValue) {  
                // remove styles else it will overwrite   
                 this.removeStyleClass('green');  
                 this.removeStyleClass('yellow');  
                 this.removeStyleClass('red');  
                 // Set style Conditionally  
                 if (cellValue >= 50) {  
                     this.addStyleClass('green');  
                 } else if(cellValue < 50 && cellValue > 30) {  
                     this.addStyleClass('yellow');  
                 } else{  
                 this.addStyleClass('red');               
                 }  
                 return cellValue;  
             }), 
			sortProperty: "humidity",
			filterProperty: "humidity"			
		}));

		oTable.addColumn(new sap.ui.table.Column({
			label: new sap.ui.commons.Label({text:"temperature"}),
			template: new sap.ui.commons.TextView().bindProperty("text","temperature"),
			sortProperty: "temperature",
			filterProperty: "temperature"	
		}));
		
		oTable.setModel(oModel);
		var sort1 = new sap.ui.model.Sorter("Date",true); //true: sort descending
		var sort2 = new sap.ui.model.Sorter("Time",true);
		
//		oTable.bindRows("/DHT22",sort1);
		oTable.bindRows({
			path:"/DHT22CA",
			sorter:[sort1, sort2]});
		
		setInterval(tableRefresh, 1000 * 3); 
		
		function tableRefresh() {
			oModel.refresh();
		}
		
// 		return oTable;
		//Add the form to the panels content area
		oPanel_T.addContent(oTable);
		oPanel.addContent(oPanel_T);
		oPanel.addContent(oPanel_C);
		
		var gmap = '<div id="googlemap" style="width:100%;height:350px;"></div>' + 
		  '<script>function myMap()' +
		  '{var AGL = {lat: -37.816786, lng: 144.951028};' +
		  ' var map = new google.maps.Map(document.getElementById("googlemap"), {zoom: 15,center: AGL});' +
		  ' var marker = new google.maps.Marker({position: AGL, map: map, label:"You are Here"});}</script>' +
		  '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyClJffM9RAQlMN2nonUjnLHp_0uLL3Ifpw&callback=myMap"></script>';		
		
	    var gmaphtml = new sap.ui.core.HTML();
	    gmaphtml.setContent(gmap);

		oPanel_M.addContent(gmaphtml);
		oPanel.addContent(oPanel_M);		
//		// create map and bind to model
//		var oVBI = new sap.ui.vbm.GeoMap({
//		   width : "100%",
//		   initialPosition: "144.951028;-37.816786",
//		   height: 350,
//		   initialZoom: "15",
//		});
//
//		//add explicite object
//		oVBI.addVo( new sap.ui.vbm.Spots({ 
//		                items: [
//		                  new sap.ui.vbm.Spot({ 
//		                	   position: "144.951028;-37.816786;0",
//		                	   text: "AGL Energy",
//		                	   type: "Default", 
//		                	   tooltip: "AGL"
//		                	   })
//		                ]
//		  }) 
//		);		
//		oPanel.addContent(oVBI);

		return oPanel;
	}

});