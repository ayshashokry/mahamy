const config = {
  master: {
    baseUrl: "http://77.30.168.84/gisapidevv2",
    fileUrl: "http://77.30.168.84/gisapi",
  },
  stage: {
    baseUrl: "http://77.30.168.84/gisapitestv2",
    fileUrl: "http://77.30.168.84/gisapi",
  },
  prod: {
    baseUrl: "https://webgis.eamana.gov.sa/gisapiv2",
    fileUrl: "https://webgis.eamana.gov.sa/gisapi",
  },
  prod_deploy: {
    baseUrl: window.origin + "/gisapiv2",
    fileUrl: window.origin + "/gisapi",
  },
};

export default config;
