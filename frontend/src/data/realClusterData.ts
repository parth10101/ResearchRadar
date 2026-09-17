// Authentic 3D UMAP scientific embedding coordinates (300 documents, 11 clusters + 1 outlier set)
// Direct PCA-Initialized 3D UMAP projection from 384-D SPECTER embeddings
// Two-Scale Hierarchical Layout (VOSviewer / van Eck & Waltman 2010; Noack 2007)
// Google Brain TensorFlow Embedding Projector (Smilkov et al., IEEE VIS 2016)
// Kobak & Linderman (Nature Biotechnology 2021) global topology preservation

export interface RealClusterPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  title: string;
  citations: number;
  doi: string;
  year: number;
  clusterId?: number;
  color?: string;
  size?: number;
  authors?: string[];
  venue?: string;
  tldr?: string;
  abstract?: string;
}

export interface RealClusterItem {
  id: string;
  clusterId: number;
  name: string;
  color: string;
  pointCount: number;
  centroid: { x: number; y: number; z: number };
  points: RealClusterPoint[];
}

export interface SemanticEdge {
  source: string;
  target: string;
  clusterId: number;
  color: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
  similarity: number;
}

export const REAL_CLUSTERS: RealClusterItem[] = [
  {
    "id": "-1",
    "clusterId": -1,
    "name": "Outlier Papers (Floating)",
    "color": "#aaaaaa",
    "pointCount": 18,
    "centroid": {
      "x": 1.5044,
      "y": -1.486,
      "z": 0.2542
    },
    "points": [
      {
        "id": "00b1e7a7e1eb",
        "x": 1.8398,
        "y": -2.1186,
        "z": -0.409,
        "title": "Monitoring and Detection of Volcanic Activity in Near Real-Time Using Intelligent Distributed Satellite Systems",
        "citations": 2,
        "doi": "10.1109/IGARSS52108.2023.10282765",
        "year": 2023,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Kathiravan Thangavel", "Dario Spiller", "Stefania Amici", "Roberto Sabatini"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "Volcanic eruptions are a natural hazard that can devastate people and property.",
        "abstract": "Volcanic eruptions are a natural hazard that can devastate people and property. In recent years, the number of volcanic eruptions has been on the rise, and the effects of climate change are making them more frequent and more powerful. This research proposes a new methodology for monitoring volcanoes in real-time or very close to real-time using an intelligent Distributed Satellite System (iDSS). The iDSS is made up of a constellation of satellites that are all connected to one another by means of Inter-Satellite Links (ISL). This allows the data to be processed and distributed in real-time, which is essential for early warning of volcanic eruptions. In previous studies, the on-board volcanic eruption detection was proven to be possible and feasible by utilising appropriate Artificial Intelligence (AI) techniques. Multispectral optical data were used to assess if an active volcanic eruption was captured in the image. The proposed iDSS architecture is practical and can be used to monitor volcanoes in real-time or near real-time. The system has been tested by taking Mount Etna as a case study and the results have been reported. The findings and conclusions of this research can be applied to and expanded upon in the context of similar natural disasters occurring around the globe."
      },
      {
        "id": "00b456dd9817",
        "x": 1.4923,
        "y": -1.4037,
        "z": 0.081,
        "title": "High-Precision Multi-Source Fusion Navigation Solutions for Complex and Dynamic Urban Environments",
        "citations": 10,
        "doi": "10.3390/rs17081371",
        "year": 2025,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Long Li", "W. Nie", "Wenpeng Zong", "Tianhe Xu", "Mowen Li", "Nan Jiang", "Wei Zhang"],
        "venue": "Remote Sensing",
        "tldr": "To address this issue, we propose a multi-source fusion navigation algorithm tailored for dynamic urban canyon scenarios, aiming to achieve reliable and continuous state estimation in complex environments.",
        "abstract": "With the rapid advancement of artificial intelligence, particularly in fields such as autonomous driving, drone delivery, and logistics automation, the demand for high-precision and robust navigation services has become critical. In complex and dynamic urban environments, the navigation capabilities of single-sensor systems struggle to meet the practical requirements of autonomous driving technology. To address this issue, we propose a multi-source fusion navigation algorithm tailored for dynamic urban canyon scenarios, aiming to achieve reliable and continuous state estimation in complex environments. In our proposed method, we utilize independent threads on a graphics processing unit (GPU) to perform real-time detection and removal of dynamic objects in visual images, thereby enhancing the visual accuracy of multi-source fusion navigation in dynamic scenes. To tackle the challenges of significant Global Navigation Satellite System (GNSS) positioning errors and limited satellite availability in urban canyon environments, we introduce a specialized GNSS Real-Time Kinematic (RTK) stochastic model for such settings. The navigation performance of the proposed algorithm was evaluated using public datasets. The results demonstrate that our RTK/INS/Vision integrated navigation algorithm effectively improves both accuracy and availability in dynamic urban canyon environments."
      },
      {
        "id": "00c70ab78b1c",
        "x": 1.0277,
        "y": -1.2782,
        "z": 0.12,
        "title": "Detecting Forest Degradation in the Three-North Forest Shelterbelt in China from Multi-Scale Satellite Images",
        "citations": 26,
        "doi": "10.3390/rs13061131",
        "year": 2021,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Tao Yu", "Pengju Liu", "Qiang Zhang", "Yizhe Ren", "Jingning Yao"],
        "venue": "Remote Sensing",
        "tldr": "In this paper, a quick and applicable approach was developed for monitoring forest degradation in the Three-North Forest Shelterbelt in China from multi-scale remote sensing data.",
        "abstract": "Detecting forest degradation from satellite observation data is of great significance in revealing the process of decreasing forest quality and giving a better understanding of regional or global carbon emissions and their feedbacks with climate changes. In this paper, a quick and applicable approach was developed for monitoring forest degradation in the Three-North Forest Shelterbelt in China from multi-scale remote sensing data. Firstly, Normalized Difference Vegetation Index (NDVI), Enhanced Vegetation Index (EVI), Ratio Vegetation Index (RVI), Leaf Area Index (LAI), Fraction of Photosynthetically Active Radiation (FPAR) and Net Primary Production (NPP) from remote sensing data were selected as the indicators to describe forest degradation. Then multi-scale forest degradation maps were obtained by adopting a new classification method using time series MODerate Resolution Imaging Spectroradiometer (MODIS) and Landsat Enhanced Thematic Mapper Plus (ETM+) images, and were validated with ground survey data. At last, the criteria and indicators for monitoring forest degradation from remote sensing data were discussed, and the uncertainly of the method was analyzed. Results of this paper indicated that multi-scale remote sensing data have great potential in detecting regional forest degradation."
      },
      {
        "id": "00e72e3ef8ab",
        "x": 1.671,
        "y": -1.5767,
        "z": 0.6115,
        "title": "Methods and algorithms for identifying special points in images obtained from an onboard photo video recorder of an unmanned aerial vehicle",
        "citations": 0,
        "doi": "10.21869/2223-1536-2025-15-1-91-116",
        "year": 2025,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["I. N. Gorbachev", "R. Tomakova", "S. Korobkov"],
        "venue": "Proceedings of the Southwest State University. Series: IT Management, Computer Science, Computer Engineering. Medical Equipment Engineering",
        "tldr": "The purpose of the research is to develop methods for controlling unmanned aerial vehicles based on the analysis of data coming from a video stream.Methods.",
        "abstract": "The purpose of the research is to develop methods for controlling unmanned aerial vehicles based on the analysis of data coming from a video stream.Methods. An unmanned aerial vehicle can lose contact with the satellite navigation system, so the task of ensuring its orientation using an onboard photo video recorder with onboard data processing becomes relevant. For this purpose, special points on the terrain are used, the identification of which in the picture allows restoring the orientation of the aircraft. To search for special points of the blob type in the picture, a method is proposed for transforming the original image into a criterion image, after threshold processing of which the coordinates of the blobs are obtained. A method has been developed for transforming the original image into a criterion image, which consists in determining correlation images. For each correlation image, a scalar blob identification criterion is determined, which allows determining the coordinates of a special point in pictures obtained from an onboard photo video recorder.Results. To improve the accuracy of determining the coordinates of blobs in pictures, an aggregated blob of three special points was used. An algorithm for two-stage identification of coordinates of an aggregated blob is investigated. At the first stage, the coordinates of special points closest to the coordinates of the vertices of the aggregated blob are determined, and at the second stage, the coordinates of the vertices of the triangle whose center of gravity is closest to the center of gravity of the aggregated blob are determined. The algorithms for searching for special points have shown their efficiency at a high level of interference modeled in the image by means of Gaussian noise, as well as interference associated with the deviation of the aircraft from the specified course.Conclusion. The formation of an aggregated blob with subsequent multi-stage identification allows for increasing the accuracy of determining its coordinates, and also makes it possible to record the deviation from the course of the aircraft in the area of two adjacent images and introduce appropriate corrections into the navigation system."
      },
      {
        "id": "017d98857b17",
        "x": 2.2442,
        "y": -1.042,
        "z": 0.922,
        "title": "Оценка разносезонных изображений Sentinel-2 для классификации лесного покрова водоохранных зон рек Марийского Заволжья",
        "citations": 1,
        "doi": "10.25686/2306-2827.2023.2.77",
        "year": 2023,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["\u041b. \u0412. \u0422\u0430\u0440\u0430\u0441\u043e\u0432\u0430", "\u042d. \u0410. \u041a\u0443\u0440\u0431\u0430\u043d\u043e\u0432", "\u041e. \u041d. \u0412\u043e\u0440\u043e\u0431\u044c\u0451\u0432", "\u0421. \u0410. \u041b\u0435\u0436\u043d\u0438\u043d"],
        "venue": "Vestnik of Volga State University of Technology Series Forest. Ecology. Nature Management",
        "tldr": "Водоохранные (защитные) леса являются уязвимыми экосистемами с характерными растительными сообществами, произрастающими на относительно богатых пойменных землях, что отличает их от других лесных насаждений.",
        "abstract": "\u0412\u0432\u0435\u0434\u0435\u043d\u0438\u0435. \u0412\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0435 (\u0437\u0430\u0449\u0438\u0442\u043d\u044b\u0435) \u043b\u0435\u0441\u0430 \u044f\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0443\u044f\u0437\u0432\u0438\u043c\u044b\u043c\u0438 \u044d\u043a\u043e\u0441\u0438\u0441\u0442\u0435\u043c\u0430\u043c\u0438 \u0441 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u043d\u044b\u043c\u0438 \u0440\u0430\u0441\u0442\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u043c\u0438 \u0441\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u0430\u043c\u0438, \u043f\u0440\u043e\u0438\u0437\u0440\u0430\u0441\u0442\u0430\u044e\u0449\u0438\u043c\u0438 \u043d\u0430 \u043e\u0442\u043d\u043e\u0441\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0431\u043e\u0433\u0430\u0442\u044b\u0445 \u043f\u043e\u0439\u043c\u0435\u043d\u043d\u044b\u0445 \u0437\u0435\u043c\u043b\u044f\u0445, \u0447\u0442\u043e \u043e\u0442\u043b\u0438\u0447\u0430\u0435\u0442 \u0438\u0445 \u043e\u0442 \u0434\u0440\u0443\u0433\u0438\u0445 \u043b\u0435\u0441\u043d\u044b\u0445 \u043d\u0430\u0441\u0430\u0436\u0434\u0435\u043d\u0438\u0439. \u041e\u0446\u0435\u043d\u043a\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u043e \u043b\u0435\u0441\u043d\u043e\u043c \u043f\u043e\u043a\u0440\u043e\u0432\u0435 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u0437\u043e\u043d \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0441\u043e\u0431\u043e\u0439 \u043a\u043b\u044e\u0447\u0435\u0432\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u0434\u043b\u044f \u043f\u043e\u043d\u0438\u043c\u0430\u043d\u0438\u044f \u0430\u043d\u0442\u0440\u043e\u043f\u043e\u0433\u0435\u043d\u043d\u043e\u0433\u043e \u0438 \u043f\u0440\u0438\u0440\u043e\u0434\u043d\u043e\u0433\u043e \u0432\u043b\u0438\u044f\u043d\u0438\u044f \u043d\u0430 \u044d\u0442\u0438 \u044d\u043a\u043e\u0441\u0438\u0441\u0442\u0435\u043c\u044b. \u0414\u043b\u044f \u044d\u0442\u0438\u0445 \u0446\u0435\u043b\u0435\u0439 \u0448\u0438\u0440\u043e\u043a\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u044b\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u043d\u0430 \u043e\u0431\u043b\u0430\u0447\u043d\u043e\u0439 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0435 Google Earth Engine (GEE) \u043f\u043e \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0435 \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445. \u0426\u0435\u043b\u044c \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f \u2013 \u043e\u0446\u0435\u043d\u0438\u0442\u044c \u043f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0441\u043f\u0435\u043a\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432 \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 \u0441\u043d\u0438\u043c\u043a\u043e\u0432 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u0430 Sentinel-2 \u0434\u043b\u044f \u043a\u0430\u0440\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043e\u0446\u0435\u043d\u043a\u0438 \u043b\u0435\u0441\u043d\u043e\u0433\u043e \u043f\u043e\u043a\u0440\u043e\u0432\u0430 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u0437\u043e\u043d \u0440\u0435\u043a \u0432 GEE. \u041e\u0431\u044a\u0435\u043a\u0442\u0430\u043c\u0438 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f \u044f\u0432\u0438\u043b\u0438\u0441\u044c \u043b\u0435\u0441\u043d\u044b\u0435 \u043d\u0430\u0441\u0430\u0436\u0434\u0435\u043d\u0438\u044f, \u043f\u0440\u043e\u0438\u0437\u0440\u0430\u0441\u0442\u0430\u044e\u0449\u0438\u0435 \u0432 \u0434\u0432\u0443\u0445\u0441\u043e\u0442\u043c\u0435\u0442\u0440\u043e\u0432\u043e\u0439 \u0431\u0443\u0444\u0435\u0440\u043d\u043e\u0439 (\u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u043e\u0439) \u0437\u043e\u043d\u0435 \u0443\u0447\u0430\u0441\u0442\u043a\u043e\u0432 \u0440\u0435\u043a \u0420\u0443\u0442\u043a\u0430, \u041f\u0430\u0440\u0430\u0442, \u0411\u043e\u043b\u044c\u0448\u0430\u044f \u041a\u043e\u043a\u0448\u0430\u0433\u0430, \u0411\u043e\u043b\u044c\u0448\u043e\u0439 \u041a\u0443\u043d\u0434\u044b\u0448, \u0412\u043e\u043b\u0433\u0430, \u041c\u0430\u043b\u0430\u044f \u041a\u043e\u043a\u0448\u0430\u0433\u0430, \u041c\u0430\u043b\u044b\u0439 \u041a\u0443\u043d\u0434\u044b\u0448, \u0418\u043b\u0435\u0442\u044c, \u042e\u0448\u0443\u0442, \u041e\u0448\u043b\u0430, \u0411\u043e\u043b\u044c\u0448\u0430\u044f \u041e\u0448\u043b\u0430 \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0438 \u041c\u0430\u0440\u0438\u0439 \u042d\u043b \u0432 \u0440\u0430\u043c\u043a\u0430\u0445 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u043e\u0439 \u0441\u0446\u0435\u043d\u044b T38VPH Sentinel-2. \u041c\u0435\u0442\u043e\u0434\u044b \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f. \u0412 \u0440\u0430\u0431\u043e\u0442\u0435 \u0431\u044b\u043b\u0430 \u043f\u0440\u043e\u0432\u0435\u0434\u0435\u043d\u0430 \u0443\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c\u0430\u044f \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u044b\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439 Sentinel-2 \u043c\u0435\u0442\u043e\u0434\u043e\u043c \u00ab\u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e\u0433\u043e \u043b\u0435\u0441\u0430\u00bb (RF \u0430\u043d\u0433\u043b. - Random Forest) \u0432 GEE \u043f\u043e 9 \u043a\u043b\u0430\u0441\u0441\u0430\u043c \u043d\u0430\u0437\u0435\u043c\u043d\u043e\u0433\u043e \u043f\u043e\u043a\u0440\u043e\u0432\u0430 (8 \u043a\u043b\u0430\u0441\u0441\u043e\u0432 \u0434\u0440\u0435\u0432\u0435\u0441\u043d\u044b\u0445 \u043f\u043e\u0440\u043e\u0434 \u0438 1\u2013\u043d\u0435\u043b\u0435\u0441\u043d\u044b\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438). \u041d\u0430 \u043f\u0435\u0440\u0432\u043e\u043c \u044d\u0442\u0430\u043f\u0435 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u044b \u0438 \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u0446\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u0447\u0435\u0442\u044b\u0440\u0435 \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 (\u0437\u0438\u043c\u0430, \u0432\u0435\u0441\u043d\u0430, \u043b\u0435\u0442\u043e, \u043e\u0441\u0435\u043d\u044c) \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f Sentinel-2 \u0441 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u0438\u0445 \u0441\u043f\u0435\u043a\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432. \u041f\u043e\u0441\u043b\u0435 \u044d\u0442\u043e\u0433\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u044b \u043f\u043e \u043f\u044f\u0442\u044c \u043d\u0430\u0438\u0431\u043e\u043b\u0435\u0435 \u0437\u043d\u0430\u0447\u0438\u043c\u044b\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0438\u0441\u0441\u043b\u0435\u0434\u0443\u0435\u043c\u043e\u0433\u043e \u0441\u0435\u0437\u043e\u043d\u0430 \u0438 \u0441\u043e\u0437\u0434\u0430\u043d\u043e \u043e\u0434\u043d\u043e \u043a\u043e\u043c\u0431\u0438\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u043d\u0430 \u0438\u0445 \u043e\u0441\u043d\u043e\u0432\u0435. \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0438 \u0432\u044b\u0432\u043e\u0434\u044b. \u041e\u0431\u0449\u0430\u044f \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043f\u0440\u043e\u0432\u0435\u0434\u0451\u043d\u043d\u043e\u0439 \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u0441\u043e\u0441\u0442\u0430\u0432\u0438\u043b\u0430 87,4 %, \u0430 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442 \u041a\u0430\u043f\u043f\u0430 \u2013 0,84. \u041d\u0430\u0438\u043c\u0435\u043d\u044c\u0448\u0430\u044f \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0435\u0442\u0441\u044f \u043f\u043e \u043a\u043b\u0430\u0441\u0441\u0430\u043c \u00ab\u041e\u043b\u044c\u0445\u0430\u00bb \u0438 \u00ab\u041e\u0441\u0438\u043d\u0430\u00bb \u2013 \u043e\u043a\u043e\u043b\u043e 64 %. \u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043a\u0430\u0437\u0430\u043b\u043e, \u0447\u0442\u043e \u0434\u043b\u044f \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u043f\u043e\u0440\u043e\u0434\u043d\u043e\u0433\u043e \u0441\u043e\u0441\u0442\u0430\u0432\u0430 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u043b\u0435\u0441\u043e\u0432 \u043d\u0430\u0438\u0431\u043e\u043b\u0435\u0435 \u043f\u0440\u0438\u0435\u043c\u043b\u0435\u043c\u044b \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u0441\u043f\u0435\u043a\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0435 \u043a\u0430\u043d\u0430\u043b\u044b \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u0430 Sentinel-2 \u2013 \u0432\u0435\u0433\u0435\u0442\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u043a\u0440\u0430\u0439\u043d\u0438\u0439 \u043a\u0440\u0430\u0441\u043d\u044b\u0439 \u043b\u0435\u0442\u043d\u0435\u0433\u043e \u0438 \u043e\u0441\u0435\u043d\u043d\u0435\u0433\u043e \u0441\u0435\u0437\u043e\u043d\u043e\u0432, \u0430 \u0442\u0430\u043a\u0436\u0435 \u043a\u043e\u0440\u043e\u0442\u043a\u043e\u0432\u043e\u043b\u043d\u043e\u0432\u044b\u0439 \u0438\u043d\u0444\u0440\u0430\u043a\u0440\u0430\u0441\u043d\u044b\u0439 \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d \u0432\u0435\u0441\u0435\u043d\u043d\u0435\u0433\u043e \u0438 \u043e\u0441\u0435\u043d\u043d\u0435\u0433\u043e \u0441\u0435\u0437\u043e\u043d\u0430. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0431\u043b\u0430\u0447\u043d\u044b\u0445 \u0432\u044b\u0447\u0438\u0441\u043b\u0435\u043d\u0438\u0439 \u0437\u043d\u0430\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0443\u043f\u0440\u043e\u0449\u0430\u0435\u0442 \u043f\u0440\u043e\u0446\u0435\u0441\u0441 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u0438 \u0430\u043d\u0430\u043b\u0438\u0437\u0430 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u044b\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439, \u0430 \u043f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439 \u0438 \u0432\u044b\u0431\u043e\u0440 \u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432 \u043c\u043e\u0433\u0443\u0442 \u043f\u043e\u0432\u044b\u0441\u0438\u0442\u044c \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u043b\u0435\u0441\u043e\u0432.  Introduction. Riparian forests are vulnerable ecosystems with specific plant communities growing in relatively rich floodplain soils, which distinguishes them from other forest plantations. The assessment of data on forest cover in riparian zones provides the key information for understanding anthropogenic and natural impacts on these ecosystems. For these purposes, satellite images are widely used, which are available on the Google Earth Engine (GEE) cloud platform for global data processing. The aim of the study is to evaluate the use of spectral bands of Sentinel-2 satellite multi-season images for mapping and assessing the forest cover of riparian zones in GEE. The objects of the study were forest plantations growing in a 200-meter buffer (water protection) zone of the rivers Rutka, Parat, Bolshaya Kokshaga, Bolshoy Kundysh, Volga, Malaya Kokshaga, Maly Kundysh, Ilet, Yushut, Oshla, and Bolshaya Oshla of the Republic of Mari El, within the framework of Sentinel-2 satellite scene T38VPH. Research methods. Supervised classification of Sentinel-2 satellite multi-season images was carried out on the basis of the random forest (RF) method in GEE according to 9 classes of land cover (8 classes of tree species and 1 - non-forest areas). At the first stage of the study, four multi-season (winter, spring, summer, autumn) Sentinel-2 images were created and classified using several spectral bands. After that, five most significant bands of the images for each studied season were selected and one combined image was created based on them. Results and conclusions. The overall accuracy of the classification was 87.4%, and the Kappa coefficient was 0.84. The lowest accuracy rate of approximately 64% was found for the Alder and Aspen classes. The study showed that the following spectral bands of the Sentinel-2 satellite are most suitable for classifying the species composition of riparian forests: the vegetation red edge band of the summer and autumn seasons, as well as the short-wave infrared range of the spring and autumn seasons. The use of cloud computing greatly simplifies satellite image processing and analysis, while the use of multi-season images and the selection of appropriate bands can improve the accuracy of riparian forest classification."
      },
      {
        "id": "01cefcfab510",
        "x": 1.9314,
        "y": -0.8363,
        "z": 0.1254,
        "title": "Autonomous Image Georeferencing Based on Database Image Matching",
        "citations": 2,
        "doi": "10.1109/ICARES.2018.8547086",
        "year": 2018,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["P. R. Hakim", "Ade Putri Septi Jayani", "A. Sarah", "W. Hasbi"],
        "venue": "2018 IEEE International Conference on Aerospace Electronics and Remote Sensing Technology (ICARES)",
        "tldr": "As an experimental remote sensing microsatellite, LAPAN-A3/IPB satellite has been continuously producing daily multispectral images for monitoring Indonesian archipelago.",
        "abstract": "As an experimental remote sensing microsatellite, LAPAN-A3/IPB satellite has been continuously producing daily multispectral images for monitoring Indonesian archipelago. The autonomous image preprocessing software has been developed to process raw image into systematically corrected image, except for high level image georeferencing process which is still conducted manually. This research aims to develop an autonomous image georeferencing for LAPAN-A3/IPB multispectral images so that entire image preprocessing can be executed autonomously. The algorithm is based on template image matching approach, by using numerous of previously processed images. The developed algorithm has been well validated and successfully georeferences LAPAN-A3/IPB multispectral images with a good accuracy. The time needed for the algorithm to process single image can be considered very fast, therefore the algorithm can be integrated into already established image preprocessing software. With this fully autonomous image preprocessing, each raw image captured could be processed inside one hour since its acquisition, allowing fast and consistent image distribution to the end user."
      },
      {
        "id": "01d10dfdff4a",
        "x": 0.4683,
        "y": -2.0049,
        "z": 0.6553,
        "title": "Machine learning approach to extract building footprint from high-resolution images: the case study of Makkah, Saudi Arabia",
        "citations": 6,
        "doi": "10.1093/IJLCT/CTAA099",
        "year": 2021,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Kamil Faisal", "A. Imam", "A. Majrashi", "I. Hegazy"],
        "venue": "International Journal of Low-Carbon Technologies",
        "tldr": "Extracting and identifying building boundaries from high-resolution images have been a hot topic in the field of remote sensing for years.",
        "abstract": "Extracting and identifying building boundaries from high-resolution images have been a hot topic in the field of remote sensing for years. Various methods including geometric, radiometric, object based and edge detection were previously deliberated and implemented in different studies in the context of building extraction. Nevertheless, the reliability of extraction process is mainly subject to user intervention. The current study proposes a new automatic morphology-based approach for extracting buildings using high-resolution satellite images of Al-Hudaybiyah region in the city of Makkah as a case study. The proposed technique integrates the support vector machine for extracting buildings that have bright and dark roofs. The appropriateness of this method has been examined by means of various indicators for example completeness, correctness and quality. Preliminary findings will illustrate the precision and accuracy of the used machine learning algorithm. Research results can provide a generic indicator to assist the planning authorities in achieving better urban planning processes taking into account all potential environmental, social and urban demands and requirements."
      },
      {
        "id": "01f40b5c0f9f",
        "x": 2.0356,
        "y": -1.6607,
        "z": 0.227,
        "title": "Using the method of image decomposition based on topological features for processing satellite images",
        "citations": 0,
        "doi": "10.47148/1609-364x-2023-4-74-80",
        "year": 2023,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["S. Eremeev", "A. Abakumov", "Sergey A. Krainov", "A. Kozlov"],
        "venue": "Geoinformatika",
        "tldr": "The problem of interpretation of spatial data on satellite images is considered in the article.",
        "abstract": "The problem of interpretation of spatial data on satellite images is considered in the article. It is proposed to use the decomposition of images by topological features to highlight objects of interest, global and detailed structures on satellite images. The description of the method and the features of its implementation for creating a software product with effective algorithms for processing big data are given. The functionality of the developed software, which includes the classification of objects on satellite images, segmentation, binarization, noise removal is described. It is shown that these algorithms are built on a single theoretical basis in the form of a topological decomposition. Examples of using the program for segmentation and binarization of satellite images from urban neighborhoods are demonstrated."
      },
      {
        "id": "02649373a017",
        "x": 2.1623,
        "y": -1.2786,
        "z": 0.8021,
        "title": "Sat-Crop transformer: integrating temporal satellite imagery and GAN-based synthesis for vegetation health monitoring",
        "citations": 0,
        "doi": "10.1117/1.JRS.20.024515",
        "year": 2026,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Hemalatha Munusamy", "Jashvinu Yeshwanth Raj", "D. Mani", "A. M. B. Deepak Athipan"],
        "venue": "Journal of Applied Remote Sensing",
        "tldr": "We introduce an innovative approach that integrates satellite imagery analysis and predictive modeling to predict vegetation indices and generate synthetic field images.",
        "abstract": "Abstract. Monitoring vegetation health is vital for environmental management, agriculture, and land use planning. We introduce an innovative approach that integrates satellite imagery analysis and predictive modeling to predict vegetation indices and generate synthetic field images. We propose the Sat-Crop Transformer, a transformer-based model specifically designed for satellite crop monitoring for the prediction of crop health. Historical satellite imagery data, including vegetation indices such as the modified soil-adjusted vegetation index and environmental parameters, are used to predict future vegetation indices. The Sat-Crop Transformer demonstrates better performance in capturing long-range dependencies in temporal satellite data. A generative adversarial network\u2013based approach is used to generate synthetic field images corresponding to the predicted vegetation indices, thereby enhancing the data visualization and model training. This integration of advanced predictive modeling and image generation provides a deeper understanding of environmental processes and supports decision-making in various domains."
      },
      {
        "id": "026ca3492a44",
        "x": 1.4378,
        "y": -1.528,
        "z": -1.0168,
        "title": "Research on the current state of Shatsk Lakes using remote sensing of the Earth",
        "citations": 0,
        "doi": "10.17721/phgg.2025.48.1/129.03",
        "year": 2025,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Oksana M. Pidkova"],
        "venue": "Physical Geography and Geomorphology",
        "tldr": "Shatsk Lakes, located within the Shatsk National Nature Park, are characterized by a number problems of a natural and anthropogenic nature, which worsen the ecological condition of both the lakes themselves and the natural complexes around them.",
        "abstract": "Shatsk Lakes, located within the Shatsk National Nature Park, are characterized by a number problems of a natural and anthropogenic nature, which worsen the ecological condition of both the lakes themselves and the natural complexes around them. The current state of Shatsk Lakes was analyzed using remote sensing methods. The main emphasis was placed on the study of Lake Svitiaz, as the largest lake in the Shatsk Lakes group and the main tourist attraction in the region. By analyzing satellite images on the online services Copernicus Browser and Google Earth Engine, changes in lake water content during 2017-2024 was analyzed, the phenomenon of eutrophication was investigated using the NDVI index for the period 2020-2024, and multi-temporal maps of land cover types and a map of projected changes in land cover types in the Shatsk Lakes area by 2050 were created. Based on the conducted research, it was found that the main environmental problems of this region are decreasing water content of lakes, shallowing, eutrophication processes, development of coastal zones. These processes tend to progress, which will have a negative impact on the entire ecosystem of Shatsk Lakes and worsen the functioning of this nature conservation area."
      },
      {
        "id": "028430030226",
        "x": 0.4974,
        "y": -1.2582,
        "z": 0.3562,
        "title": "Neural Networks for Content-Based Image Retrieval",
        "citations": 6,
        "doi": "10.4018/978-1-59904-370-8.CH012",
        "year": 2007,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["B. Verma", "S. Kulkarni"],
        "venue": "Academic Conference",
        "tldr": "This chapter introduces neural networks for content-based image retrieval (CBIR) systems.",
        "abstract": "This chapter introduces neural networks for content-based image retrieval (CBIR) systems. It presents a critical literature review of both the traditional and neural network-based techniques that are used to retrieve images based on their content. It shows how neural networks and fuzzy logic can be used in the interpretation of queries, feature extraction, and classification of features by describing a detailed research methodology. It investigates a neural network-based technique in conjunction with fuzzy logic to improve the overall performance of CBIR systems. The results of the investigation on a benchmark database with a comparative analysis are presented in this chapter. The methodologies and results presented in this chapter will allow researchers to improve and compare their methods, and it also will allow system developers to understand and implement the neural network and fuzzy logic-based techniques for content-based image retrieval. 701 E. Chocolate Avenue, Suite 200, Hershey PA 17033-1240, USA Tel: 717/533-8845; Fax 717/533-8661; URL-http://www.irm-press.com ITB13861 IRM PRESS This chapter appears in the book, Semantic-Based Visual Information Retrieval by Y.J. Zhang \u00a9 2007, Idea Group Inc. Neural Networks for Content-Based Image Retrieval Copyright \u00a9 2007, Idea Group Inc. Copying or distributing in print or electronic forms without written permission of Idea Group Inc. is prohibited. Introduction Recent technological advances in computer-based storage, transmission, and display of image data and the Internet have made it possible to process and store large amounts of image data. Perhaps the most impressive example is the fast accumulation of image data in scientific applications such as medical and satellite imagery. The Internet is another excellent example of a distributed database containing several million images. In recent years, there has been a rapid increase in the size of digital image collections. Retrieving images from large collections effectively and efficiently based on their content has become an important research issue for database, image-processing, and computer-vision communities. Creating and storing digital images nowadays is easy and getting cheaper all the time as the needed technologies are becoming available. There already is a vast number of digital visual data sources (e.g., various kinds of sensors, digital cameras, and scanners) in addition to the various image collections and databases for all kinds of purposes. Furthermore, the fast development of computing hardware has enabled us to switch from text-based computing to graphical user interfaces (GUIs) and multimedia applications. This transaction has fundamentally changed the use of computers and made visual information an inseparable part of everyday computing. As a result, the amount of information in visual form is increasing, and we need effective ways to process it. The existing and widely adopted methods for text-based data usually are inadequate for these purposes. Visual information generally is said to include both still images and moving videos. It is well-known that a successful CBIR system will have a large number of applications. Although many CBIR systems have been built, the performance of these systems is far from the demands of various applications. The aim of CBIR research is to retrieve desired images from such large collections automatically. Toward this goal, automatic CBIR systems have become an active research area in the last decade. One of the solutions is the development of automated methods that are able to recognize the composition and content of the images and to make use of the recognized image content in order to achieve content-based image retrieval. Such kinds of image retrieval systems involve a great deal of image understanding and machine intelligence. In addition, an ideal system should allow both a keyword and a concept search in conjunction with a content-based search. This already can be seen in many image retrieval systems. However, most of them do not provide flexibility in formulating these queries. At the start, the user should be able either to issue a direct query or to query by example. There is no good or proven way to search for and retrieve images from databases without annotation. Given the enormous amount of images stored on computers, annotation is becoming more and more impractical, and the need for an automatic feature identification based on image retrieval is growing. Techniques that are based on neural networks also have been developed for CBIR. The main reason for using neural networks in CBIR is due to their adaptive learning capability. Neural networks offer unsupervised clustering as well as supervised learning mechanisms for the retrieval of images. Recent research in image retrieval suggests that significant improvement in retrieval performance requires techniques that, in some sense, \u201cunderstand\u201d the content of the image and queries. Recently, image retrieval researchers have used the application domain knowledge to determine relevant relationships between images and queries. The aim of the research presented in this chapter is to show the possibility of learning and use of domain knowledge in an image retrieval application by means of the learning and generalization capabilities of neural networks. 19 more pages are available in the full version of this document, which may be purchased using the \"Add to Cart\" button on the publisher's webpage: www.igi-global.com/chapter/neural-networks-content-basedimage/28930"
      },
      {
        "id": "02961229198d",
        "x": 1.309,
        "y": -1.0046,
        "z": 0.6188,
        "title": "Deployment of Attention-based VGG19 with Deep SVM for Soil Moisture and Vegetation Index Prediction in Agriculture Field using Satellite Images",
        "citations": 0,
        "doi": "10.1109/ICOSEC67334.2025.11459783",
        "year": 2025,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["M. A. Nagasai", "S.Maruthupermal"],
        "venue": "2025 6th International Conference on Smart Electronics and Communication (ICOSEC)",
        "tldr": "Variation in soil moisture content can greatly affect crop growth and agricultural productivity.",
        "abstract": "Variation in soil moisture content can greatly affect crop growth and agricultural productivity. While soil moisture provides needed water for plants, excessive soil moisture can hinder crop growth. Therefore, it is necessary to develop effective methods for analyzing normal soil moisture levels before the harvesting period of crops to boost agricultural output. It helps predict and analyze water cycles, climate crises, water vapour transport, drought, water management, and overflow during rainfall. In particular, the conventional technique for measuring habitat structure has difficulty in understanding variation among habitat categories due to the complex patterns. In agricultural settings, the integration of aerial and satellite imagery techniques has improved the ability to monitor the yields. In this study, an effective attention-based deep learning method is proposed for the prediction of soil moisture and vegetation index analysis. Firstly, the required samples of satellite images are garnered from the benchmark datasets. Consequently, the input images are processed under Attention-based Visual Geometry Group 19 with Deep Support Vector Machine (A-VGG19-DSVM) for predicting the soil moisture and vegetation index level. Lastly, the experimentation of the proposed model is assessed with distinct evaluation metrics. On the contrary, the results are obtained by the proposed method to prove the efficacy."
      },
      {
        "id": "02f48e96155d",
        "x": 0.9861,
        "y": -2.3628,
        "z": 0.8635,
        "title": "COMPARING THE ACCURACY OF GNSS POSITIONING VARIANTS FOR UAV BASED 3D MAP GENERATION",
        "citations": 4,
        "doi": "10.5194/isprs-archives-xliii-b1-2020-443-2020",
        "year": 2020,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["H. Amlashi", "F. Samadzadegan", "Farzaneh Dadras Javan", "M. Savadkouhi"],
        "venue": "Academic Conference",
        "tldr": "GNSS stands for Global Navigation Satellite System and is the standard generic term for satellite navigation systems that provide autonomous geo-spatial positioning with global coverage.",
        "abstract": "Abstract. GNSS stands for Global Navigation Satellite System and is the standard generic term for satellite navigation systems that provide autonomous geo-spatial positioning with global coverage. The advantage of having access to multiple satellites is accuracy, redundancy, and availability at all the times. Though satellite systems do not often fail, if one fails GNSS receivers can pick up signals from other systems. If the line of sight is obstructed, having access to multiple satellites is also a benefit. GPS (Global Positioning System, USA), GLONASS (Global Navigation Satellite System, Russia), BeiDou (Compass, China), and some regional systems are positioning systems that are usually used. In recent years with the development of the UAVs and GNSS receivers, it is possible to manage an accurate PPK (Post Processing Kinematic) networks with a GNSS receiver mounted on a UAV to achieve the position of images principal points WGS1984 and to reduce the need for GCPs. But the most important challenge in a PPK task is, which a combination of different GNSS constellations would result in the most accurate computed position in checkpoints. For this purpose, this study focused on a PPK equipped UAV to map an open pit (Golgohar mine near Sirjan city). For the purpose, different combination of GPS, GLONASS and BeiDou used for position computed. Results are plotted and compared and found out having access to multiple constellations while doing a PPK task would bring higher accuracies in building photogrammetric models although it may cause some random error due to the higher values of noise while the number of the satellites increases."
      },
      {
        "id": "0343c71611f3",
        "x": 0.8361,
        "y": -1.8888,
        "z": 0.8773,
        "title": "Comparative Analysis of Global Solar Radiation Estimation Models - A case study: Algeria",
        "citations": 2,
        "doi": "10.1109/ICAEE47123.2019.9014705",
        "year": 2019,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Benmouiza Khalil", "Cheknane Ali"],
        "venue": "International Conference on Advances in Electrical Engineering",
        "tldr": "Hence, in this paper, we will present a description and classification of some solar radiation estimation models based on ground measurements.",
        "abstract": "Studying of solar radiation is essential to estimate its amount at ground level. In practice, there are two sources of solar data; the first consists of the measured ground data available in meteorological networks and radiometric solar stations. And, the other consists of extracting solar data from digital satellite images. However, only a few stations measured irregularly the amount solar radiation. Hence, in this paper, we will present a description and classification of some solar radiation estimation models based on ground measurements. Moreover, satellite image processing models are also discussed, an improvement of these models using fuzzy logic is also viewed. The validity of these models will be judged by comparing the obtained results by actually measured values of the available ground stations."
      },
      {
        "id": "Anti-satellite",
        "x": 1.2854,
        "y": -0.9711,
        "z": 0.5041,
        "title": "Anti-satellite glia cell IgG antibodies in fibromyalgia patients are related to symptom severity and to metabolite concentrations in thalamus and rostral anterior cingulate cortex.",
        "citations": 40,
        "doi": "10.1016/j.bbi.2023.09.003",
        "year": 2023,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["S. Fanton", "Joana Menezes", "E. Krock", "Angelica Sandstr\u00f6m", "Jeanette Tour", "Katalin Sandor", "A. Jurczak", "Matthew A Hunt", "Azar Baharpoor", "D. Kadetoff", "Karin B. Jensen", "Peter Fransson", "I. Ellerbrock", "R. Sitnikov", "Camilla I. Svensson", "E. Kosek"],
        "venue": "Brain, behavior, and immunity",
        "tldr": "Recent translational work has shown that fibromyalgia (FM) might be an autoimmune condition with pathogenic mechanisms mediated by a peripheral, pain-inducing action of IgG antibodies binding to satellite glia cells (SGC) in the dorsal root ganglia (DRG).",
        "abstract": ""
      },
      {
        "id": "Multiple",
        "x": 1.858,
        "y": -1.0513,
        "z": 0.0881,
        "title": "Multiple roles of syndecan-4 during myoblast migration",
        "citations": 0,
        "doi": "10.14232/phd.10858",
        "year": 2021,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["D\u00e1niel Becsky"],
        "venue": "Academic Conference",
        "tldr": "Background and purpose: Cell migration is one of the cornerstones of regeneration processes, as it is necessary for wound healing, and also required for embryonic development, immune system activation, or tumor metastasis formation.",
        "abstract": ""
      },
      {
        "id": "Bone",
        "x": 2.2074,
        "y": -2.3299,
        "z": -0.0314,
        "title": "Bone marrow derived cells in adult skeletal muscle tissue in humans",
        "citations": 17,
        "doi": "10.1186/2044-5040-3-12",
        "year": 2013,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["A. Str\u00f6mberg", "M. Jansson", "H. Fischer", "E. Rullman", "H. H\u00e4gglund", "T. Gustafsson"],
        "venue": "Skeletal Muscle",
        "tldr": "BackgroundDuring the past decade, several animal studies have demonstrated that in addition to local cells, cells from the bone marrow (BM) possess the ability to contribute to regeneration of injured skeletal muscle tissue.",
        "abstract": ""
      },
      {
        "id": "Cy3",
        "x": 1.7892,
        "y": -1.1545,
        "z": -0.819,
        "title": "Cy3‐Conjugated Biocompatible Polymer Nanoparticles for Long‐Term Mitochondrial Imaging",
        "citations": 0,
        "doi": "10.1002/cbic.70323",
        "year": 2026,
        "clusterId": -1,
        "color": "#aaaaaa",
        "size": 0.2,
        "authors": ["Souma Kawashima", "Mitsuo Inui", "Izumi Takaba", "Haruka Taniguchi", "Koji Nagahama"],
        "venue": "ChemBioChem",
        "tldr": "In this study, we designed modified dye in which biocompatible polymers were covalently attached to Cy3.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "1",
    "clusterId": 1,
    "name": "Topic 0: Deep Satellite Image Class",
    "color": "#E41A1C",
    "pointCount": 54,
    "centroid": {
      "x": 0.752,
      "y": 1.4654,
      "z": -1.4603
    },
    "points": [
      {
        "id": "Remote",
        "x": 0.8178,
        "y": 1.5264,
        "z": -1.7373,
        "title": "Remote sensing intelligent interpretation for geology: from perspective of geological exploration",
        "citations": 1,
        "doi": "10.1080/00206814.2025.2460040",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Fitria Helmiza"],
        "venue": "Soviet Economy",
        "tldr": "This book offers an in-depth exploration of advanced remote sensing technologies in geological studies.",
        "abstract": ""
      },
      {
        "id": "Hybrid",
        "x": 0.6035,
        "y": 1.5316,
        "z": -1.4468,
        "title": "Hybrid Enriched Stacked Auto Encoder and FFO-MPARCNN Algorithm for the Multispectral Image LULC Classification",
        "citations": 0,
        "doi": "10.21203/RS.3.RS-717451/V1",
        "year": 2021,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Bhuvaneswari E", "Anil Kumar T Ch", "Haqqani Arshad", "Dhanagopal R", "Bharath Kumar Narukullapati"],
        "venue": "Academic Conference",
        "tldr": "The satellite imagery classification task is fundamental to spatial knowledge discovery.",
        "abstract": ""
      },
      {
        "id": "Collective",
        "x": 0.8726,
        "y": 1.5078,
        "z": -1.293,
        "title": "Collective view: mapping Sargassum distribution along beaches",
        "citations": 28,
        "doi": "10.7717/peerj-cs.528",
        "year": 2021,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Javier Arellano-Verdejo", "H. Lazcano-Hernandez"],
        "venue": "PeerJ Computer Science",
        "tldr": "The atypical arrival of pelagic Sargassum to the Mexican Caribbean beaches has caused considerable economic and ecological damage.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.8298,
        "y": 1.2373,
        "z": -1.6107,
        "title": "A hybrid approach for enhanced flood prediction and assessment: Leveraging physical models, deep learning and satellite remote sensing",
        "citations": 26,
        "doi": "10.1080/20964471.2025.2530850",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Mohammad Roohi", "H. Ghafouri", "S. M. Ashrafi", "Mahdi Motagh", "M. Haghshenas Haghighi"],
        "venue": "Academic Conference",
        "tldr": "ABSTRACT Accurate real-time information is crucial for effective flood risk management, especially in regions with complex terrain and irregular rainfall patterns.",
        "abstract": ""
      },
      {
        "id": "Injecting",
        "x": 0.8243,
        "y": 1.4936,
        "z": -1.3257,
        "title": "Injecting spatial priors in Earth observation with machine vision",
        "citations": 0,
        "doi": "10.18174/466814",
        "year": 2019,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Diego Gonz\u00e1lez"],
        "venue": "Academic Conference",
        "tldr": "Remote Sensing (RS) imagery with submeter resolution is becoming ubiquitous.",
        "abstract": ""
      },
      {
        "id": "Automatic",
        "x": 0.7283,
        "y": 1.2514,
        "z": -1.5318,
        "title": "Automatic Feature Extraction from High-Resolution Satellite Imagery using Deep Learning techniques",
        "citations": 1,
        "doi": "10.1109/RAEEUCCI61380.2024.10547851",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Kasarapu Ramani", "A. Chinna", "G. S. Suchith", "G. Reshma", "I. Reddy"],
        "venue": "2024 International Conference on Recent Advances in Electrical, Electronics, Ubiquitous Communication, and Computational Intelligence (RAEEUCCI)",
        "tldr": "This paper introduces an innovative feature extraction approach utilizing Deep learning techniques such as Pix2Pix GAN (Generative Adversarial Network) for semantic segmentation and improving the object delineation, such as land, buildings, roads, and water features, in image-to-image translation tasks.",
        "abstract": ""
      },
      {
        "id": "Domain",
        "x": 0.9639,
        "y": 1.5012,
        "z": -1.317,
        "title": "Domain Adaption for Fine-Grained Urban Village Extraction From Satellite Images",
        "citations": 73,
        "doi": "10.1109/LGRS.2019.2947473",
        "year": 2020,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Q. Shi", "Mengxi Liu", "Xiaoping Liu", "Penghua Liu", "Pengyuan Zhang", "Jinxing Yang", "Xia Li"],
        "venue": "IEEE Geoscience and Remote Sensing Letters",
        "tldr": "In this letter, we propose using the domain adaptation strategy to tackle the domain shift problem by employing adversarial learning to tune the semantic segmentation network so as to adaptively obtain similar outputs for input images from different domains.",
        "abstract": ""
      },
      {
        "id": "RAG",
        "x": 0.5713,
        "y": 1.3057,
        "z": -1.3845,
        "title": "RAG Augmented Explainable Deep Learning for Satellite Image Classification",
        "citations": 0,
        "doi": "10.1109/ICCIDS69108.2026.11407853",
        "year": 2026,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["S. M", "Yesvanthika J", "A. R", "Varalakshmi M", "Peer Mohamed P U"],
        "venue": "2026 9th International Conference on Computational Intelligence in Data Science (ICCIDS)",
        "tldr": "Applications of Land Use Land Cover (LULC) classification span multiple fields, including disaster management, environmental monitoring, climate change studies, Urban planning, policy-making, and beyond.",
        "abstract": ""
      },
      {
        "id": "USAGE",
        "x": 0.8852,
        "y": 1.6136,
        "z": -1.601,
        "title": "USAGE OF CONVOLUTIONAL NEURAL NETWORK FOR MULTISPECTRAL IMAGE PROCESSING APPLIED TO THE PROBLEM OF DETECTING FIRE HAZARDOUS FOREST AREAS",
        "citations": 11,
        "doi": "10.20998/2522-9052.2019.1.19",
        "year": 2019,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Vladyslav Yaloveha", "Daria Hlavcheva", "A. Podorozhniak"],
        "venue": "Advanced Information Systems",
        "tldr": "Neural networks are intensively developed and used in all spheres of human activity in the modern world.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": 0.8645,
        "y": 1.2154,
        "z": -1.6076,
        "title": "An Open-Access Cross-Modal Forest Benchmark Training Dataset With Sentinel-1 and Lidar data",
        "citations": 0,
        "doi": "10.1109/IGARSS55030.2025.11243038",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["H. Aghababaei", "G. Ferraioli", "Gilda Schirinzi", "E. Tomppo", "J. Parks"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "To address the current gap in forest SAR datasets, this paper introduces a new benchmark dataset, comprising pre-processed Sentinel-1 polarimetric interferometric data annotated with forest height information derived from space-based LiDAR data.",
        "abstract": ""
      },
      {
        "id": "Optimizing",
        "x": 0.5511,
        "y": 1.3171,
        "z": -1.2903,
        "title": "ID: 2604.13283 | Year: 2026",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "GPROF-NN",
        "x": 0.5457,
        "y": 1.5846,
        "z": -1.5295,
        "title": "GPROF-NN: a neural-network-based implementation of the Goddard Profiling Algorithm",
        "citations": 34,
        "doi": "10.5194/amt-15-5033-2022",
        "year": 2022,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["S. Pfreundschuh", "P. Brown", "C. Kummerow", "P. Eriksson", "Teodor Norrestad\u200b\u200b\u200b\u200b\u200b\u200b\u200b"],
        "venue": "Atmospheric Measurement Techniques",
        "tldr": "We present two neural-network-based, probabilistic implementations of GPROF: GPROF-NN 1D, which (just like the current GPROF implementation) processes pixels individually, and GPROF-NN 3D, which employs a convolutional neural network to incorporate structural information into the retrieval.",
        "abstract": ""
      },
      {
        "id": "Intelligent",
        "x": 0.8338,
        "y": 1.2651,
        "z": -1.4711,
        "title": "Intelligent Remote Sensing Scene Classification Model for On-Board Training of Resource-Constrained Devices",
        "citations": 2,
        "doi": "10.54216/jchci.090101",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Ahmad Ahmad", "Josef Al Jumayel"],
        "venue": "Journal of Cognitive Human-Computer Interaction",
        "tldr": "Remote Sensing Scene Classification (RSSC) is the distinctive classification of remote sensing images into numerous classes of scene classifications based on the image content.",
        "abstract": ""
      },
      {
        "id": "Land",
        "x": 0.5584,
        "y": 1.4337,
        "z": -1.3854,
        "title": "Land Cover Change Detection Using Convolution Neural Network",
        "citations": 4,
        "doi": "10.1109/ICECA.2019.8821840",
        "year": 2019,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["T. M", "P. P.", "Ravichand S", "A. T"],
        "venue": "2019 3rd International conference on Electronics, Communication and Aerospace Technology (ICECA)",
        "tldr": "In this paper, Land cover classification and change detection is made using high resolution satellite images of Guntur region taken over the years 2013 and 2016 with Landsat-7.",
        "abstract": ""
      },
      {
        "id": "Efficient",
        "x": 0.6224,
        "y": 1.2296,
        "z": -1.3356,
        "title": "Efficient Classification for Intelligent and Robust Satellite Image Encryption",
        "citations": 1,
        "doi": "10.1109/JSTARS.2025.3610790",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Salah-Eddine Tbahriti", "Nabil Boughanmi"],
        "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
        "tldr": "To address this limitation, we propose a dual-stage framework that combines fast, content-aware image classification with high-performance selective encryption.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.737,
        "y": 1.6054,
        "z": -1.5732,
        "title": "A Novel Approach for Oil Spill Detection from SAR Images",
        "citations": 6,
        "doi": "10.1109/ICCEBS58601.2023.10448846",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["D. Roopa", "M. Subashini", "S. Mathupriya", "R. Prabha", "G. Senthil"],
        "venue": "2023 Intelligent Computing and Control for Engineering and Business Systems (ICCEBS)",
        "tldr": "The main aim of this study is to identify instances of oil spills through the use of images taken from satellite.",
        "abstract": ""
      },
      {
        "id": "Segmentation",
        "x": 0.7697,
        "y": 1.6041,
        "z": -1.2888,
        "title": "Segmentation and Evaluation of Water-Bodies from Satellite Images",
        "citations": 0,
        "doi": "10.1109/ICRISET64803.2025.11251940",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["J. Glady", "Jamal Zaidi", "K. Vijayakumar", "Uday Kumar Maurya", "S. Prabha"],
        "venue": "International Conference Emerging Trends Engineering, Science and Technology",
        "tldr": "Remote sensing and image-based assessment methodologies are frequently employed in satellite image-based water body detection to identify, delineate, and monitor lakes, rivers, and reservoirs for environmental management purposes.",
        "abstract": ""
      },
      {
        "id": "UnCRtainTS",
        "x": 0.868,
        "y": 1.6241,
        "z": -1.6755,
        "title": "ID: 2304.05464 | Year: 2023",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Deep-Learning-Based",
        "x": 0.8492,
        "y": 1.2283,
        "z": -1.5405,
        "title": "ID: 2109.00400 | Year: 2021",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Urban",
        "x": 0.65,
        "y": 1.4278,
        "z": -1.3661,
        "title": "Urban Building Function Mapping by Integrating Cross-View Geospatial Data",
        "citations": 0,
        "doi": "10.1109/IGARSS53475.2024.10641009",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Dairong Chen", "Weijia Li", "Hong Fan"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "In the face of rapid urbanization, traditional methods for mapping urban functional zones prove inadequate in both efficiency and scale.",
        "abstract": ""
      },
      {
        "id": "Leveraging",
        "x": 0.8727,
        "y": 1.5688,
        "z": -1.6874,
        "title": "Leveraging Pre-trained Deep Learning Models for Remote Sensing Image Classification: A Case Study with ResNet50 and EfficientNet",
        "citations": 7,
        "doi": "10.11648/j.ajset.20240903.11",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Srivani Bobba"],
        "venue": "American Journal of Science, Engineering and Technology",
        "tldr": "The procedure of categorizing images from remote sensing is also another application of machine learning not just ground-based platforms (for instance satellites), aerial platforms become platforms sometimes in aviation either.",
        "abstract": ""
      },
      {
        "id": "Enhanced",
        "x": 0.9322,
        "y": 1.6522,
        "z": -1.4581,
        "title": "Enhanced synthetic aperture radar image autofocus and classification using 2D SARNet framework",
        "citations": 4,
        "doi": "10.1117/1.JRS.18.026507",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["M. Sakr", "Ahmed Saleh", "F. Abdelkader", "G. Amer", "Mohamed AboElenean"],
        "venue": "Journal of Applied Remote Sensing",
        "tldr": "We present an SAR processing pipeline comprising a complex 2D autofocus SARNet, followed by a CNN-based classification model.",
        "abstract": ""
      },
      {
        "id": "UCWater",
        "x": 0.8102,
        "y": 1.6027,
        "z": -1.5846,
        "title": "UCWater: Unsupervised Content-Adaptive Water-Body Extraction Framework for High-Resolution Satellite Imagery",
        "citations": 0,
        "doi": "10.1109/IGARSS47720.2021.9553270",
        "year": 2021,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Jiahui Yang", "Qiqi Zhu", "Jianjun Lv", "Qingfeng Guan"],
        "venue": "2021 IEEE International Geoscience and Remote Sensing Symposium IGARSS",
        "tldr": "In this paper, an unsupervised content-adaptive water-body extraction framework (UCWater) is proposed for HRSI.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": 0.7472,
        "y": 1.4415,
        "z": -1.7535,
        "title": "An innovative traffic light recognition method using vehicular ad-hoc networks",
        "citations": 13,
        "doi": "10.1038/s41598-023-31107-8",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Esraa Al-Ezaly", "Hazem M. El-bakry", "Ahmed Abo-Elfetoh", "Sara Elhishi"],
        "venue": "Scientific Reports",
        "tldr": "Car congestion is a pressing issue for everyone on the planet.",
        "abstract": ""
      },
      {
        "id": "Layer-Sensitivity-Aware",
        "x": 0.4485,
        "y": 1.4971,
        "z": -1.3969,
        "title": "Layer-Sensitivity-Aware Hybrid Redundancy Hardening Design for Reliable CNN Accelerators",
        "citations": 0,
        "doi": "10.1109/LGRS.2026.3719316",
        "year": 2026,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Xingtong Yu", "Yu Xie", "He Chen", "Shuo Ni", "Haitao Chen", "Ning Zhang"],
        "venue": "IEEE Geoscience and Remote Sensing Letters",
        "tldr": "Convolutional neural networks (CNNs) are increasingly deployed in satellite remote sensing signal processing systems to support onboard image interpretation and low-latency intelligent processing.",
        "abstract": ""
      },
      {
        "id": "APPLICATION",
        "x": 0.8366,
        "y": 1.474,
        "z": -1.5739,
        "title": "APPLICATION OF MACHINE LEARNING FOR OBJECT DETECTION IN OBLIQUE AERIAL IMAGES",
        "citations": 2,
        "doi": "10.5194/isprs-archives-xliii-b2-2022-657-2022",
        "year": 2022,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["P. Zachar", "Z. Kurczynski", "W. Ostrowski"],
        "venue": "The International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences",
        "tldr": "At the time of continuous development of all technologies, deep machine learning (more precisely, convolutional neural networks), which is one of the branches of artificial intelligence (AI), has found wide application in many fields, including photogrammetry and remote sensing.",
        "abstract": ""
      },
      {
        "id": "Vessel",
        "x": 0.9508,
        "y": 1.4631,
        "z": -1.4321,
        "title": "Vessel Detection using Image Processing and Neural Networks",
        "citations": 5,
        "doi": "10.1109/IGARSS39084.2020.9323883",
        "year": 2020,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["K. Bereta", "R. Grasso", "D. Zissis"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "In this paper we describe a multistage data-centric workflow that integrates satellite optical imagery and AIS data for automatic vessel detection that builds on (i) image processing techniques and (ii) Convolutional Neural networks.",
        "abstract": ""
      },
      {
        "id": "Training-free",
        "x": 0.9036,
        "y": 1.4341,
        "z": -1.3404,
        "title": "ID: 2506.04285 | Year: 2025",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Comparative",
        "x": 0.8708,
        "y": 1.646,
        "z": -1.3855,
        "title": "Comparative Analysis of Various Machine Learning Techniques for Flood Prediction",
        "citations": 9,
        "doi": "10.1109/ICITIIT54346.2022.9744177",
        "year": 2022,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Sajimon Abraham", "Jyothish V R", "Sijo Thomas", "B. Jose"],
        "venue": "2022 International Conference on Innovative Trends in Information Technology (ICITIIT)",
        "tldr": "A flood is a most destructive disaster that affects people, places, and lives.",
        "abstract": ""
      },
      {
        "id": "Improvement",
        "x": 0.7124,
        "y": 1.3647,
        "z": -1.2466,
        "title": "Improvement of Satellite Image Classification Using Attention-Based Vision Transformer",
        "citations": 6,
        "doi": "10.5220/0012298400003636",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Nawel Slimani", "Imen Jdey", "M. Kherallah"],
        "venue": "International Conference on Agents and Artificial Intelligence",
        "tldr": ": This study introduces a transformative approach to satellite image classification using the Vision Transformer (ViT) model, a revolutionary deep learning method.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.7972,
        "y": 1.4948,
        "z": -1.3711,
        "title": "ID: 1907.05283 | Year: 2019",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Classification",
        "x": 0.4588,
        "y": 1.5168,
        "z": -1.3787,
        "title": "Classification of the global Sentinel-1 SAR vignettes for ocean surface process studies",
        "citations": 60,
        "doi": "10.1016/j.rse.2019.111457",
        "year": 2019,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Chen Wang", "P. Tandeo", "A. Mouche", "J. Stopa", "Victor Gressani", "Nicolas Long\u00e9p\u00e9", "D. Vandemark", "R. Foster", "B. Chapron"],
        "venue": "Academic Conference",
        "tldr": "In this study, we propose to apply the emerging deep learning approach in ocean SAR scenes classification.",
        "abstract": ""
      },
      {
        "id": "Toward",
        "x": 0.49,
        "y": 1.5147,
        "z": -1.4468,
        "title": "Toward the recognition of spacecraft feature components: A new benchmark and a new model",
        "citations": 30,
        "doi": "10.1007/s42064-021-0103-3",
        "year": 2021,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Linwei Qiu", "Liang Tang", "R. Zhong"],
        "venue": "Astrodynamics",
        "tldr": "Considering real-world illumination conditions and imperfect camera observations, we developed a degradation algorithm that enabled us to produce thousands of artificial images of spacecraft.",
        "abstract": ""
      },
      {
        "id": "Para-YOLO",
        "x": 0.8953,
        "y": 1.2781,
        "z": -1.5276,
        "title": "Para-YOLO: An Efficient High-Parameter Low-Computation Algorithm Based on YOLO11n for Remote Sensing Object Detection",
        "citations": 4,
        "doi": "10.1109/JSTARS.2025.3576221",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Hang Chen", "Qi Cao", "Yongqiang Wang", "Shang Wang", "H. Fu", "Zhenjiao Chen", "Feng Liang"],
        "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
        "tldr": "To overcome these challenges, we propose Para-YOLO, an efficient and cost-effective algorithm consisting of a novel feature fusion network and three innovative modules.",
        "abstract": ""
      },
      {
        "id": "High-resolution",
        "x": 0.5897,
        "y": 1.5733,
        "z": -1.3794,
        "title": "ID: 2405.04483 | Year: 2024",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.8508,
        "y": 1.5747,
        "z": -1.324,
        "title": "ID: 1702.07985 | Year: 2017",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.7044,
        "y": 1.5034,
        "z": -1.6828,
        "title": "A Hybrid Preference Interaction Mechanism for Multi-Satellite Imaging Dynamic Mission Planning",
        "citations": 2,
        "doi": "10.3390/electronics13122374",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Xueying Yang", "Min Hu", "Gang Huang", "Yijun Wang"],
        "venue": "Electronics",
        "tldr": "The existing multi-satellite dynamic mission planning system hardly satisfies the requirements of fast response time and high mission benefit in highly dynamic situations.",
        "abstract": ""
      },
      {
        "id": "URBAN",
        "x": 0.8291,
        "y": 1.5972,
        "z": -1.6864,
        "title": "URBAN ENVIRONMENTAL FLOOD SUSCEPTIBILITY USING A MULTI-LAYERED NEURAL NETWORK MODEL FROM SATELLITE IMAGERY SOURCES",
        "citations": 0,
        "doi": "10.30955/gnj.005139",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Global NEST. International Journal",
        "tldr": "Recently, there has been a rise in research based on data-driven based machine learning models to address the issue of processing speed posed by various physiological simulations.",
        "abstract": ""
      },
      {
        "id": "Modality-Aware",
        "x": 0.5311,
        "y": 1.4943,
        "z": -1.3315,
        "title": "Modality-Aware Feature Integration for Pan-Sharpening",
        "citations": 14,
        "doi": "10.1109/TGRS.2022.3232384",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Man Zhou", "Jie Huang", "Fengmei Zhao", "D. Hong"],
        "venue": "IEEE Transactions on Geoscience and Remote Sensing",
        "tldr": "To address this issue, we propose a novel information compensation and integration network for pan-sharpening by effective cross-modality joint learning in this work.",
        "abstract": ""
      },
      {
        "id": "Super-Resolution",
        "x": 0.5568,
        "y": 1.5481,
        "z": -1.4742,
        "title": "Super-Resolution of Satellite Images by two-Dimensional RRDB and Edge-Enhancement Generative Adversarial Network",
        "citations": 7,
        "doi": "10.1109/icassp43922.2022.9747063",
        "year": 2022,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Yu-Zhang Chen", "Tsung-Jung Liu", "Kuan-Hsien Liu"],
        "venue": "IEEE International Conference on Acoustics, Speech, and Signal Processing",
        "tldr": "With the increasing demand for high-resolution images, image super-resolution (SR) technology has become one of the focuses in related research fields.",
        "abstract": ""
      },
      {
        "id": "Land",
        "x": 0.7064,
        "y": 1.2146,
        "z": -1.4566,
        "title": "Land Cover Analysis with Fully Convolutional Network",
        "citations": 0,
        "doi": "10.37396/jsc.v8i1.496",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Abib Raifmuaffah Ihwan", "Nouval Trezandy Lapatta", "Yuri Yudhaswana Joefrie", "Yusuf Anshori", "Syahrullah Syahrullah"],
        "venue": "Jurnal Sistem Cerdas",
        "tldr": "This study analyses land cover in Morowali Regency using Sentinel-2 satellite imagery and the Fully Convolutional Network (FCN) algorithm.",
        "abstract": ""
      },
      {
        "id": "Remote",
        "x": 0.9685,
        "y": 1.4328,
        "z": -1.6426,
        "title": "Remote Sensing Based Land Cover Classification Using Machine Learning and Deep Learning: A Comprehensive Survey",
        "citations": 2,
        "doi": "10.47164/ijngc.v14i2.1137",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Soma Mitra", "Dr. Saikat Basu"],
        "venue": "International Journal of Next-Generation Computing",
        "tldr": "Since the 1990s, remote sensing images have been used for land cover classification combined with MachineLearning algorithms.",
        "abstract": ""
      },
      {
        "id": "Deep",
        "x": 0.6189,
        "y": 1.242,
        "z": -1.302,
        "title": "Deep learning for weak signal acquisition: correlation peak pixel absolute position using deep CNNs",
        "citations": 2,
        "doi": "10.1109/icspcc52875.2021.9564619",
        "year": 2021,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Bo Lu", "Wenjing Chen", "Chen Qu"],
        "venue": "International Conference on Signal Processing, Communications and Computing",
        "tldr": "In a fading environment, satellite navigation signal is so weak that a receiver hardly has a high detection probability using traditional acquisition algorithm.",
        "abstract": ""
      },
      {
        "id": "Multilevel",
        "x": 0.9947,
        "y": 1.6309,
        "z": -1.2894,
        "title": "Multilevel Semantic Labeling of Mobile Homes from Overhead Imagery",
        "citations": 0,
        "doi": "10.1109/IGARSS.2018.8517660",
        "year": 2018,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["D. Lunga", "M. Seals", "B. Bhaduri"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "Finding where people live and the vulnerabilities of manmade facilities during natural disasters is not only critical for rescue efforts but also essential for damage assessment in the aftermath.",
        "abstract": ""
      },
      {
        "id": "Compressive",
        "x": 0.6429,
        "y": 1.4869,
        "z": -1.3247,
        "title": "Compressive Sensing Based Reconstruction and Pixel-Level Classification of Very High-Resolution Disaster Satellite Imagery Using Deep Learning",
        "citations": 5,
        "doi": "10.1109/IGARSS.2019.8899871",
        "year": 2019,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Rajat C. Shinde", "Abhishek V. Potnis", "S. Durbha", "Prakash Andugula"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "In this work, we propose a two-fold analysis of the Very High Resolution (VHR) satellite imagery based on Compressive Sensing (CS) and Deep Learning.",
        "abstract": ""
      },
      {
        "id": "Enhancing",
        "x": 0.8913,
        "y": 1.5724,
        "z": -1.6748,
        "title": "Enhancing Remote Sensing Image Scene Classification With Satellite-Terrestrial Collaboration and Attention-Aware Transmission Policy",
        "citations": 2,
        "doi": "10.1109/TMC.2025.3526142",
        "year": 2025,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Anqi Lu", "Youbing Hu", "Zhiqiang Cao", "Jie Liu", "Lingzhi Li", "Zhijun Li"],
        "venue": "IEEE Transactions on Mobile Computing",
        "tldr": "To address this, we propose a novel Satellite-Terrestrial Collaborative Scene Classification (STCSC) framework that integrates transmission and computation.",
        "abstract": ""
      },
      {
        "id": "Super-Resolution",
        "x": 0.7362,
        "y": 1.4596,
        "z": -1.3536,
        "title": "Super-Resolution Data Augmentation Method on 2D Segmentation of 3D Point Cloud Data",
        "citations": 0,
        "doi": "10.1109/ELECO64362.2024.10847095",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["M. O. \u015eerifo\u011flu", "Do\u011facan Toka", "M. Darici", "Elif G\u00fcm\u00fc\u015fl\u00fc"],
        "venue": "International Conference on Electrical and Electronics Engineering",
        "tldr": "3D deep learning methods are widely used in point cloud semantic segmentation.",
        "abstract": ""
      },
      {
        "id": "Big",
        "x": 0.7161,
        "y": 1.3372,
        "z": -1.4957,
        "title": "Big Earths of China: Remotely Sensing Xinjiang along the Belt and Road",
        "citations": 4,
        "doi": "10.1086/721173",
        "year": 2022,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Shaoling Ma"],
        "venue": "Critical Inquiry",
        "tldr": "Undergirding China’s Belt and Road Initiative’s lofty promise of global connectivity are existing connections between the PRC’s implementation of planetary-scale observation systems for environmental sustainability and the recognizably nefarious policies of localized, colonial surveillance of Turkic minorities in the Xinjiang Uyghur Autonomous Region (XUAR).",
        "abstract": ""
      },
      {
        "id": "Learning",
        "x": 0.7457,
        "y": 1.404,
        "z": -1.5265,
        "title": "Learning point process models for vehicles detection using CNNs in satellite images",
        "citations": 1,
        "doi": "10.1109/SITIS61268.2023.00022",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Jules Mabon", "M. Ortner", "J. Zerubia"],
        "venue": "International Conference on Signal-Image Technology and Internet-Based Systems",
        "tldr": "We present a method combining marked point processes and convolutional neural networks applied to the detection of small objects in optical satellite images.",
        "abstract": ""
      },
      {
        "id": "Deep",
        "x": 0.9101,
        "y": 1.6513,
        "z": -1.4891,
        "title": "Deep Reinforcement Learning Based Interference Avoidance Beam-Hopping Allocation Algorithm in Multi-beam Satellite Systems",
        "citations": 7,
        "doi": "10.1109/TrustCom60117.2023.00268",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Haonan Wang", "Lixiang Liu", "Xin Zhou", "Lexi Xu", "Guangyang Wu", "Shuaijun Liu"],
        "venue": "International Conference on Trust, Security and Privacy in Computing and Communications",
        "tldr": "To address this issue, we propose a deep reinforcement learning based interference avoidance beam-hopping allocation algorithm(DRL-IABHA).",
        "abstract": ""
      },
      {
        "id": "Local",
        "x": 0.8249,
        "y": 1.6009,
        "z": -1.2436,
        "title": "Local PM2.5 Hotspot Detector at 300 m Resolution: A Random Forest-Convolutional Neural Network Joint Model Jointly Trained on Satellite Images and Meteorology",
        "citations": 18,
        "doi": "10.3390/rs13071356",
        "year": 2021,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Tongshu Zheng", "M. Bergin", "Guoyin Wang", "David E. Carlson"],
        "venue": "Remote Sensing",
        "tldr": "Satellite-based rapid sweeping screening of localized PM2.5 hotspots at fine-scale local neighborhood levels is highly desirable.",
        "abstract": ""
      },
      {
        "id": "Storm",
        "x": 0.5317,
        "y": 1.3749,
        "z": -1.5315,
        "title": "Storm and Disaster Risk Prediction in Coastal Areas",
        "citations": 0,
        "doi": "10.1109/AIAC63745.2024.10899543",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Chaoyang Wang", "Jinfang Hou", "Qiushi Li", "Shengbo Xu", "Zhichao Dong"],
        "venue": "2024 2nd International Conference on Artificial Intelligence and Automation Control (AIAC)",
        "tldr": "This paper addresses the critical issue of storm and disaster risk prediction in coastal regions.",
        "abstract": ""
      },
      {
        "id": "Large-scale",
        "x": 0.6103,
        "y": 1.3791,
        "z": -1.4847,
        "title": "ID: 2403.12226 | Year: 2024",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Discovery",
        "x": 0.9776,
        "y": 1.5996,
        "z": -1.2679,
        "title": "Discovery of astronomical objects in galaxies by means of deep learning",
        "citations": 2,
        "doi": "10.1051/matecconf/202439201123",
        "year": 2024,
        "clusterId": 1,
        "color": "#E41A1C",
        "size": 0.2,
        "authors": ["Ponguvala Haindavi", "Sunil Kumar", "Ganesh", "R. A. Kumar", "Gaurav Pushkarna"],
        "venue": "MATEC Web of Conferences",
        "tldr": "The study of space exploration has been studied for a very long time, and as technology has developed, so too have the methods and techniques employed, along with the quantity and type of data acquired.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "2",
    "clusterId": 2,
    "name": "Topic 1: SAR Aperture Imaging Data",
    "color": "#377EB8",
    "pointCount": 44,
    "centroid": {
      "x": -0.6559,
      "y": -0.9465,
      "z": 0.9444
    },
    "points": [
      {
        "id": "B.SAR",
        "x": -0.468,
        "y": -0.9656,
        "z": 0.891,
        "title": "ID: 1805.06343 | Year: 2018",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Repeat-pass",
        "x": -0.5507,
        "y": -0.8141,
        "z": 1.1644,
        "title": "Repeat-pass SAR Interferometry Experiments with Gaofen-3: A Case Study of Ningbo and Nanjing Area",
        "citations": 5,
        "doi": "10.1109/EORSA.2018.8598621",
        "year": 2018,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Tao Zhang", "Xiaolei Lv", "Bing Han", "Bin Lei", "L. Wan", "Jun Hong"],
        "venue": "International Workshop on Earth Observation and Remote Sensing Applications",
        "tldr": "By using the latest SAR interferogram filter and phase unwrapping method we proposed, we improved the coherence up to 0.8 in urban area.",
        "abstract": ""
      },
      {
        "id": "Hydrological",
        "x": -0.5826,
        "y": -0.8763,
        "z": 0.669,
        "title": "Hydrological instability and archaeological impact in Northwest Greenland: Sudden mass movement events signal new concerns for circumpolar archaeology",
        "citations": 15,
        "doi": "10.1016/J.QUASCIREV.2020.106600",
        "year": 2020,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Matthew Walls", "Madisen Hvidberg", "Mari Kleist", "Pauline Knudsen", "Pivinnguaq M\u00f8rch", "Pia Egede", "G. Taylor", "Niki Phillips", "S. Yamasaki", "Tatsuya Watanabe"],
        "venue": "Academic Conference",
        "tldr": "In this paper, we consider implication for circumpolar archaeology, and focus analysis on a study area of critical importance to the local Inughuit community at Siorapaluk – a small settlement in Northwest Greenland.",
        "abstract": ""
      },
      {
        "id": "Seismic",
        "x": -0.5324,
        "y": -0.7844,
        "z": 0.8298,
        "title": "Seismic multi-hazard and impact estimation via causal inference from satellite imagery",
        "citations": 59,
        "doi": "10.1038/s41467-022-35418-8",
        "year": 2022,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Susu Xu", "Joshua Dimasaka", "D. Wald", "H. Noh"],
        "venue": "Nature Communications",
        "tldr": "Herein, we present a rapid seismic multi-hazard and impact estimation system that leverages advanced statistical causal inference and remote sensing techniques.",
        "abstract": ""
      },
      {
        "id": "Early",
        "x": -0.571,
        "y": -0.8657,
        "z": 1.1554,
        "title": "Early and persistent supershear rupture of the 2018 magnitude 7.5 Palu earthquake",
        "citations": 238,
        "doi": "10.1038/s41561-018-0297-z",
        "year": 2019,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["H. Bao", "J. Ampuero", "L. Meng", "E. Fielding", "C. Liang", "C. Milliner", "T. Feng", "Hui Huang"],
        "venue": "Nature Geoscience",
        "tldr": "Here we present robust evidence of an early and persistent supershear rupture at the sub-Eshelby speed of the 2018 magnitude 7.5 Palu, Indonesia, earthquake.",
        "abstract": ""
      },
      {
        "id": "Pre-eruption",
        "x": -0.9048,
        "y": -1.091,
        "z": 1.0855,
        "title": "Pre-eruption Deformation Prior to 2018 Eruption of Anak Krakatau Volcano",
        "citations": 0,
        "doi": "10.1088/1755-1315/1418/1/012026",
        "year": 2024,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["R. F. Adiwijaya", "T. P. Sidiq", "E. Kriswati"],
        "venue": "IOP Conference Series: Earth and Environment",
        "tldr": "Anak Krakatau is an active volcano situtated in Sunda Strait between Sumatera and Java that is frequently erupts.",
        "abstract": ""
      },
      {
        "id": "Two",
        "x": -0.5105,
        "y": -1.0402,
        "z": 0.9649,
        "title": "Two multi-temporal datasets to track debris flow after the 2008 Wenchuan earthquake",
        "citations": 0,
        "doi": "10.1038/s41597-022-01658-y",
        "year": 2022,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Lei Wang", "Ming-Yao Chang", "Jian Le", "Lanlan Xiang", "Zhang Ni"],
        "venue": "Scientific Data",
        "tldr": "We provide two datasets for tracking the debris flow induced by the 2008 Wenchuan Mw 7.9 earthquake on a section of the Longmen mountains on the eastern side of the Tibetan plateau (Sichuan, China).",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.8086,
        "y": -1.0784,
        "z": 0.9143,
        "title": "A Cross-Modal Multi-Attitude Framework for the Generation of Space Target ISAR Images",
        "citations": 3,
        "doi": "10.1109/ICASSP49660.2025.10888516",
        "year": 2025,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Derong Kong", "Huaizhang Liao", "Jingyuan Xia"],
        "venue": "IEEE International Conference on Acoustics, Speech, and Signal Processing",
        "tldr": "This paper introduces an innovative optical-to-radar cross-modal framework for the generation of full-attitude, high-fidelity space target ISAR samples, denominated as AORC.",
        "abstract": ""
      },
      {
        "id": "Fine-Resolution",
        "x": -0.8256,
        "y": -0.9481,
        "z": 1.0738,
        "title": "Fine-Resolution Mapping of Pan-Arctic Lake Ice-Off Phenology Based on Dense Sentinel-2 Time Series Data",
        "citations": 10,
        "doi": "10.3390/rs13142742",
        "year": 2021,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Chong Liu", "Huabing Huang", "Fengming Hui", "Ziqian Zhang", "Xiao Cheng"],
        "venue": "Remote Sensing",
        "tldr": "To fill this knowledge gap, we developed a new approach for fine-resolution mapping of Pan-Arctic lake ice-off phenology.",
        "abstract": ""
      },
      {
        "id": "AUTOMATIC",
        "x": -0.5995,
        "y": -0.8787,
        "z": 0.6865,
        "title": "AUTOMATIC CALCULATION OF OIL SLICK AREA FROM MULTIPLE SAR ACQUISITIONS FOR DEEPWATER HORIZON OIL SPILL",
        "citations": 1,
        "doi": "10.5194/ISPRSARCHIVES-XXXIX-B7-63-2012",
        "year": 2012,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["B. Osmano\u011flu", "Coskun Ozkan", "F. Sunar", "G. Staples"],
        "venue": "Academic Conference",
        "tldr": "We developed a new algorithm for determining the extent of the oil spill from multiple SAR images, that are acquired with short temporal intervals using different sensors.",
        "abstract": ""
      },
      {
        "id": "SBAS-InSAR",
        "x": -0.8938,
        "y": -0.8314,
        "z": 0.827,
        "title": "SBAS-InSAR analysis for deformation monitoring in landslide-prone areas: A case study of Murang’a and Nyeri Counties in Kenya",
        "citations": 0,
        "doi": "10.55779/ng53423",
        "year": 2025,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Alex M. Yumbu", "P. Odera"],
        "venue": "Nova Geodesia",
        "tldr": "Mass movement events impact thousands globally, causing loss of life, displacement of people and destruction of farmland and infrastructure, among other devastating impacts.",
        "abstract": ""
      },
      {
        "id": "Tracking",
        "x": -0.8008,
        "y": -0.9972,
        "z": 1.047,
        "title": "Tracking morphological changes and slope instability using spaceborne and ground-based SAR data",
        "citations": 68,
        "doi": "10.1016/J.GEOMORPH.2017.10.023",
        "year": 2018,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["F. Di Traglia", "T. Nolesini", "A. Ciampalini", "L. Solari", "William Frodella", "F. Bellotti", "A. Fumagalli", "G. De Rosa", "N. Casagli"],
        "venue": "Academic Conference",
        "tldr": "Abstract Stromboli (Aeolian Archipelago, Italy) is an active volcano that is frequently affected by moderate to large mass wasting, which has occasionally triggered tsunamis.",
        "abstract": ""
      },
      {
        "id": "SNOW",
        "x": -0.4731,
        "y": -0.796,
        "z": 1.1311,
        "title": "SNOW COVER MAPPING AND ICE AVALANCHE MONITORING FROM THE SATELLITE DATA OF THE SENTINELS",
        "citations": 9,
        "doi": "10.5194/ISPRS-ARCHIVES-XLII-3-1765-2018",
        "year": 2018,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Sisi Wang", "Baolin Yang", "Yueliang Zhou", "Futao Wang", "R. Zhang", "Qin\u2010Shi Zhao"],
        "venue": "Academic Conference",
        "tldr": "In order to monitor ice avalanches efficiently under disaster emergency conditions, a snow cover mapping method based on the satellite data of the Sentinels is proposed, in which the coherence and backscattering coefficient image of Synthetic Aperture Radar (SAR) data (Sentinel-1) is combined with the atmospheric correction result of multispectral data (Sentinel-2).",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.6312,
        "y": -1.1177,
        "z": 1.0524,
        "title": "A Procedure for the Quantitative Comparison of Rainfall and DInSAR-Based Surface Displacement Time Series in Slow-Moving Landslides: A Case Study in Southern Italy",
        "citations": 4,
        "doi": "10.3390/rs15020320",
        "year": 2023,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["F. Ardizzone", "S. L. Gariano", "E. Volpe", "L. Antronico", "R. Coscarelli", "M. Manunta", "A. Mondini"],
        "venue": "Remote Sensing",
        "tldr": "Earth observation data are useful to analyze the impact of climate-related variables on geomorphological processes.",
        "abstract": ""
      },
      {
        "id": "Analyzing",
        "x": -0.8919,
        "y": -0.9418,
        "z": 0.9355,
        "title": "Analyzing short term spatial and temporal dynamics of water presence at a basin-scale in Mexico using SAR data",
        "citations": 9,
        "doi": "10.1080/15481603.2020.1840106",
        "year": 2020,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["A. L\u00f3pez-Caloca", "F. Omar Tapia-Silva", "F. L\u00f3pez", "Henao Pilar", "A. O. Ram\u00edrez Gonz\u00e1lez", "Guadalupe Rivera"],
        "venue": "Academic Conference",
        "tldr": "ABSTRACT The dynamic nature of continental water body covers is a main indicator of the status of this ecological capital and its trends on the land surface.",
        "abstract": ""
      },
      {
        "id": "Time-series",
        "x": -0.7332,
        "y": -0.9748,
        "z": 1.0994,
        "title": "Time-series snowmelt detection over the Antarctic using Sentinel-1 SAR images on Google Earth Engine",
        "citations": 67,
        "doi": "10.1016/J.RSE.2021.112318",
        "year": 2021,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Dong Liang", "Huadong Guo", "Lu Zhang", "Yun Cheng", "Qi Zhu", "Xu-Ting Liu"],
        "venue": "Academic Conference",
        "tldr": "Abstract The Antarctic ice sheet is an important mass of glacier ice.",
        "abstract": ""
      },
      {
        "id": "Tracing",
        "x": -0.4621,
        "y": -0.8578,
        "z": 1.077,
        "title": "Tracing sulphur dioxide in volcanic deposits and ash emission during the 2019 Sinabung eruptions",
        "citations": 2,
        "doi": "10.1088/1755-1315/1306/1/012020",
        "year": 2024,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["D. Fiantis", "H. Zulhakim", "N. Yulanda", "F. I. Ginting", "Gusnidar", "S. Yasin"],
        "venue": "IOP Conference Series: Earth and Environment",
        "tldr": "Sulphur dioxide (SO2) emissions from Mt.",
        "abstract": ""
      },
      {
        "id": "Design",
        "x": -0.7751,
        "y": -1.1565,
        "z": 1.0238,
        "title": "Design and implementation of spaceborne SAR radio frequency interference detection and suppression system",
        "citations": 1,
        "doi": "10.1117/12.3010412",
        "year": 2023,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Xingwang Hu", "Hengrui Zhang", "Ning Li", "Zhengwei Guo"],
        "venue": "International Conference on Remote Sensing, Mapping, and Geographic Systems",
        "tldr": "Spaceborne synthetic aperture radar (SAR) is an active radar system carried on a satellite, with the help of synthetic aperture technology to achieve all-day, all-weather, high-resolution imaging, it has been widely used in military reconnaissance, resource exploration, deep space exploration and other fields.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.509,
        "y": -0.7395,
        "z": 1.1097,
        "title": "A method of tropospheric signal delay correction іn satellite sar observations",
        "citations": 0,
        "doi": "10.33841/1819-1339-2-48-41-48",
        "year": 2024,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["D. Kukhtar"],
        "venue": "Modern achievements of geodesic science and industry",
        "tldr": "The purpose of this work is to calculate the tropospheric signal delay using phase-based analysis for the long-term SAR observations without the involvement of auxiliary data.",
        "abstract": ""
      },
      {
        "id": "Geophysical",
        "x": -0.5736,
        "y": -0.921,
        "z": 0.7316,
        "title": "Geophysical surveys and satellite imaging for the evaluation of near‐surface terrain dynamic ‐ a case study on Grand Portage, MN, USA",
        "citations": 0,
        "doi": "10.1002/nsg.12267",
        "year": 2023,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Jeong-Mo Lee", "D. Fratta"],
        "venue": "Near Surface Geophysics",
        "tldr": "Flooding, erosion, and increases in the water level in Lake Superior have contributed to changes in the stem location and width of the Grand Portage Creek.",
        "abstract": ""
      },
      {
        "id": "Domino-style",
        "x": -0.3603,
        "y": -0.8071,
        "z": 0.8829,
        "title": "Domino-style earthquakes along blind normal faults in Northern Thessaly (Greece): kinematic evidence from field observations, seismology, SAR interferometry and GNSS",
        "citations": 29,
        "doi": "10.12681/BGSG.27102",
        "year": 2021,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["A. Ganas", "S. Valkaniotis", "P. Briole", "A. Serpetsidaki", "V. Kapetanidis", "Ilektra Karasante", "I. Kassaras", "G. Papathanassiou", "I. Karamitros", "V. Tsironi", "P. Elias", "V. Sarhosis", "A. Karakonstantis", "Emmanouela Konstantakopoulou", "P. Papadimitriou", "E. Sokos"],
        "venue": "Bulletin of the Geological Society of Greece",
        "tldr": "Here we present a joint analysis of the geodetic, seismological and geological data of the March 2021 Northern Thessaly seismic sequence, that were gathered and processed as of April 30, 2021.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": -0.7337,
        "y": -1.0544,
        "z": 0.961,
        "title": "An assessment of the spatial extent of polar dust using satellite thermal data",
        "citations": 5,
        "doi": "10.1038/s41598-020-79825-7",
        "year": 2021,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["M. Bowen", "R. Vincent"],
        "venue": "Scientific Reports",
        "tldr": "The effect of mineral dust aerosols and subsequent deposition in polar regions has historically been underestimated in climate models.",
        "abstract": ""
      },
      {
        "id": "Distributed",
        "x": -0.8627,
        "y": -0.826,
        "z": 0.9988,
        "title": "Distributed SAR Interferometry for Digital Elevation Model Generation Using Microsatellites: Processing and Demonstration",
        "citations": 1,
        "doi": "10.1109/TGRS.2026.3657152",
        "year": 2026,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Maxwell Nogueira Peixoto", "Gerhard Krieger", "Alberto Moreira", "Christian Waldschmidt", "Michelangelo Villano"],
        "venue": "IEEE Transactions on Geoscience and Remote Sensing",
        "tldr": "This work presents for the first time a concept of distributed SAR interferometry for single-pass DEM generation based on a cluster of small-aperture microsatellites, separated in both the along- and across-track directions and operating well below the Nyquist sampling frequency.",
        "abstract": ""
      },
      {
        "id": "Qualitative",
        "x": -0.9126,
        "y": -1.0302,
        "z": 0.9431,
        "title": "Qualitative Relationship of Seismic Activity with Vertical Displacements of Terrain After Mine Closure with the Use of Dinsar Technology",
        "citations": 1,
        "doi": "10.4467/21995923gp.22.006.17084",
        "year": 2022,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["P. Sopata", "Violetta Soko\u0142a-Szewio\u0142a"],
        "venue": "Geoinformatica Polonica",
        "tldr": "The liquidation process of mines is very complex and long.",
        "abstract": ""
      },
      {
        "id": "Remote",
        "x": -0.4821,
        "y": -0.8915,
        "z": 0.7656,
        "title": "Remote Sensing and Modeling of the Cryosphere in High Mountain Asia: A Multidisciplinary Review",
        "citations": 32,
        "doi": "10.3390/rs16101709",
        "year": 2024,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Qing-Hua Ye", "Yu-zhe Wang", "Lin Liu", "Linan Guo", "Xueqi Zhang", "L. Dai", "Limin Zhai", "Yafan Hu", "N. Ali", "Xinhui Ji", "Youhua Ran", "Yubao Qiu", "Lijuan Shi", "Tao Che", "Ninglian Wang", "Xin Li", "Liping Zhu"],
        "venue": "Remote Sensing",
        "tldr": "Over the past decades, the cryosphere has changed significantly in High Mountain Asia (HMA), leading to multiple natural hazards such as rock–ice avalanches, glacier collapse, debris flows, landslides, and glacial lake outburst floods (GLOFs).",
        "abstract": ""
      },
      {
        "id": "Ground",
        "x": -0.6375,
        "y": -0.9536,
        "z": 0.6208,
        "title": "Ground Stability Monitoring of Undermined and Landslide Prone Areas by Means of Sentinel-1 Multi-Temporal InSAR, Case Study from Slovakia",
        "citations": 42,
        "doi": "10.3390/GEOSCIENCES7030087",
        "year": 2017,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["R. Czikhardt", "J. Pap\u010do", "M. Bako\u0148", "P. Liscak", "P. Ondrejka", "Mari\u00e1n Zlocha"],
        "venue": "Academic Conference",
        "tldr": "Multi-temporal synthetic aperture radar interferometry techniques (MT-InSAR) are nowadays a well-developed remote sensing tool for ground stability monitoring of areas afflicted by natural hazards.",
        "abstract": ""
      },
      {
        "id": "ICINGS",
        "x": -0.8279,
        "y": -0.8898,
        "z": 0.7815,
        "title": "ICINGS IN THE PROJECT AREA OF THE POWER OF SIBERIA-2 GAS PIPELINE IN THE REPUBLIC OF BURYATIA",
        "citations": 0,
        "doi": "10.7868/s3034640125010022",
        "year": 2025,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Vladimir Chernykh"],
        "venue": "Геоэкология. Инженерная геология. Гидрогеология. Геокриология / Environmental Geoscience",
        "tldr": "The objective of this study is to evaluate the extent of icings formation along the proposed gas pipeline route within the Republic of Buryatia, including the identification of the areas of their formation, genesis, spatial and temporal dynamics, and potential negative impact on engineering structures.",
        "abstract": ""
      },
      {
        "id": "Integration",
        "x": -0.5664,
        "y": -0.8475,
        "z": 0.6318,
        "title": "Integration of Satellite Data Analysis with Ground Penetrating Radar to Map Archaeological Features in Al Aamerah, United Arab Emirates",
        "citations": 0,
        "doi": "10.1109/IWAGPR65621.2025.11109039",
        "year": 2025,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["S\u00f3nia Santos-Assun\u00e7\u00e3o", "Diana Francis", "Moamen Ali", "Cherif Charfeddine", "Mohammed Y. Ali", "M. A. Iqbal"],
        "venue": "International Workshop on Advanced Ground Penetrating Radar",
        "tldr": "Traditional techniques of locating past settlements through visual inspection and excavation can be time-consuming and insufficient.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.3877,
        "y": -1.1279,
        "z": 0.9043,
        "title": "A Novel Imaging Scheme of Squint Multichannel SAR: First Result of GF-3 Satellite",
        "citations": 2,
        "doi": "10.3390/rs14163962",
        "year": 2022,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Yini Lv", "M. Shang", "L. Zhong", "Xiaolan Qiu", "C. Ding"],
        "venue": "Remote Sensing",
        "tldr": "The azimuth multichannel synthetic aperture radar (MC-SAR) is an effective means of earth observation due to its high-resolution and wide-swath (HRWS) imaging capability.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.5244,
        "y": -0.9888,
        "z": 0.9659,
        "title": "A Gaussian Process Regression Approach for Fusion of Remote Sensing Images for Oil Spill Segmentation",
        "citations": 4,
        "doi": "10.23919/ICIF.2018.8455304",
        "year": 2018,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["F. Longman", "L. Mihaylova", "Le Yang"],
        "venue": "Fusion",
        "tldr": "This paper presents a framework using Gaussian process (GP) to fuse SAR images of different modalities and to segment dark areas (assumed oil spill) for oil spill detection.",
        "abstract": ""
      },
      {
        "id": "IEEE",
        "x": -0.671,
        "y": -0.9048,
        "z": 0.901,
        "title": "IEEE Transactions on Microwave Theory and Techniques Special Issue CFP",
        "citations": 0,
        "doi": "10.1109/mmm.2020.3020486",
        "year": 2020,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": [],
        "venue": "IEEE Microwave Magazine",
        "tldr": "Motivation The aim of this Special Issue is to publish technical papers in microwave and millimeter-wave communication and sensor systems.",
        "abstract": ""
      },
      {
        "id": "Volcanic",
        "x": -0.8347,
        "y": -0.9985,
        "z": 1.0,
        "title": "Volcanic SO2 total mass dataset on Mt. Etna (Italy) from 2018 to 2025 using sentinel-5P TROPOMI",
        "citations": 0,
        "doi": "10.1016/j.dib.2026.112876",
        "year": 2026,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["M. Dozzo", "A. Aiuppa", "G. Bilotta", "A. Cappello", "G. Ganci"],
        "venue": "Data in Brief",
        "tldr": "Sulfur dioxide (SO₂) is released by the magma degassing in the shallow crust, constituting a key indicator of magma ascent rates in the feeding conduit, as well as providing information on the style and the intensity of eruptive activity.",
        "abstract": ""
      },
      {
        "id": "Simulation",
        "x": -0.5157,
        "y": -0.8966,
        "z": 1.0865,
        "title": "Simulation of SEVIRI infrared channels: a case study from the Eyjafjallajökull April/May 2010 eruption",
        "citations": 12,
        "doi": "10.5194/AMT-6-649-2013",
        "year": 2012,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["A. Kylling", "R. Buras", "S. Eckhardt", "C. Emde", "Bernhard Mayer", "A. Stohl"],
        "venue": "Academic Conference",
        "tldr": "Infrared satellite images are widely and successfully used to detect and follow atmospheric ash from erupting volcanoes.",
        "abstract": ""
      },
      {
        "id": "Application",
        "x": -0.9048,
        "y": -1.0477,
        "z": 1.0504,
        "title": "Application of InSAR satellite method for mapping of active landslides in Bulgaria – opportunities and perspectives",
        "citations": 0,
        "doi": "10.5194/ica-proc-4-10-2021",
        "year": 2021,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["M. Atanasova", "H. Nikolov", "Lyubka Pashova"],
        "venue": "Proceedings of the ICA",
        "tldr": "In this paper, we demonstrate the applicability of Differential Sentinel-1A satellite SAR interferometry (DInSAR) to assess the movement activity and use the information for further updating the national landslide inventories in Bulgaria.",
        "abstract": ""
      },
      {
        "id": "Hydrothermal",
        "x": -0.6153,
        "y": -0.9438,
        "z": 1.0897,
        "title": "Hydrothermal alteration, fumarolic deposits and fluids from Lastarria Volcanic Complex: A multidisciplinary study",
        "citations": 35,
        "doi": "10.5027/ANDGEOV43N2-A02",
        "year": 2016,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["F. Aguilera", "Susana Layana", "A. Rodr\u00edguez-D\u00edaz", "Crist\u00f3bal Gonz\u00e1lez", "J. Cort\u00e9s", "M. Inostroza"],
        "venue": "Academic Conference",
        "tldr": "A multidisciplinary study that includes processing of Landsat ETM+ satellite images, chemistry of gas condensed, mineralogy and chemistry of fumarolic deposits, and fluid inclusion data from native sulphur deposits, has been carried out in the Lastarria Volcanic Complex (LVC) with the objective to determine the distribution and characteristics of hydrothermal alteration zones and to establish the relations between gas chemistry and fumarolic deposits.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.6567,
        "y": -1.1345,
        "z": 0.8921,
        "title": "A Recalibration Method for Historical SAR Data Through Inter-Satellite Alignment",
        "citations": 0,
        "doi": "10.1109/ICSIDP62679.2024.10868735",
        "year": 2024,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Yu-Xin Xiao", "Yongsheng Zhou", "Lingling Ma", "Fei Ma", "Q. Yin", "Fan Zhang"],
        "venue": "2024 IEEE International Conference on Signal, Information and Data Processing (ICSIDP)",
        "tldr": "Recalibration of historical Synthetic Aperture Radar (SAR) data facilitates the adjustment of data that have not undergone radiometric calibration or have suboptimal calibration accuracy, ensuring consistency among diverse historical images.",
        "abstract": ""
      },
      {
        "id": "Coastal",
        "x": -0.8452,
        "y": -0.9359,
        "z": 0.8669,
        "title": "Coastal Zone of Sevastopol on High Resolution Satellite Images",
        "citations": 10,
        "doi": "10.22449/0233-7584-2015-6-43-60",
        "year": 2015,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["\u0412.A. Dulov", "M. Yurovskaya", "I. Kozlov"],
        "venue": "Academic Conference",
        "tldr": "Landsat-8 data with spatial resolution of 30-100 m provide the ability of regular monitoring of ocean phenomena with scale of 100-1000 m.",
        "abstract": ""
      },
      {
        "id": "Deforestation",
        "x": -0.9763,
        "y": -0.8946,
        "z": 1.0021,
        "title": "Deforestation Effects on Rainfall‐Induced Shallow Landslides: Remote Sensing and Physically‐Based Modelling",
        "citations": 40,
        "doi": "10.1029/2019WR025233",
        "year": 2019,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["P. Lehmann", "J. Ruette", "D. Or"],
        "venue": "Water Resources Research",
        "tldr": "Deforestation of steep slopes may temporarily reduce evapotranspiration and lessen root reinforcement thus potentially enhancing landslide susceptibility.",
        "abstract": ""
      },
      {
        "id": "Novel",
        "x": -0.6157,
        "y": -1.1896,
        "z": 0.8019,
        "title": "Novel Comparison of Pyrocumulonimbus Updrafts to Volcanic Eruptions and Supercell Thunderstorms Using Optical Flow Techniques",
        "citations": 2,
        "doi": "10.1029/2023JD039418",
        "year": 2024,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["T. M. McHardy", "David A Peterson", "Jason M. Apke", "S. D. Miller", "James R. Campbell", "E. Hyer"],
        "venue": "Journal of Geophysical Research - Atmospheres",
        "tldr": "Convective dynamics in a supercell thunderstorm, a volcanic eruption, and two pyrocumulonimbus (pyroCb) events are compared by computing cloud‐top divergence (CTD) with an optical flow technique called Deepflow.",
        "abstract": ""
      },
      {
        "id": "Modeling",
        "x": -0.6796,
        "y": -0.9802,
        "z": 0.9549,
        "title": "Modeling and Processing of Radar Signals for Earth Observation",
        "citations": 1,
        "doi": "10.1155/2008/463741",
        "year": 2008,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["M. Greco", "S. Watts"],
        "venue": "Academic Conference",
        "tldr": "The rapidly growing number of real aperture and synthetic aperture radars (SARs) devoted to Earth observation provides today a very broad coverage across space, time, and the electromagnetic spectrum.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -0.7064,
        "y": -1.0284,
        "z": 1.0339,
        "title": "A practical algorithm for the retrieval of floe size distribution of Arctic sea ice from high-resolution satellite Synthetic Aperture Radar imagery",
        "citations": 23,
        "doi": "10.1525/ELEMENTA.154",
        "year": 2017,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["B. Hwang", "Jinchang Ren", "Samuel McCormack", "C. Berry", "Ismail Ben Ayed", "H. Graber", "E. Aptoula"],
        "venue": "Academic Conference",
        "tldr": "In this study, we present an algorithm for summer sea ice conditions that semi-automatically produces the floe size distribution of Arctic sea ice from high-resolution satellite Synthetic Aperture Radar data.",
        "abstract": ""
      },
      {
        "id": "Analysis",
        "x": -0.53,
        "y": -0.7613,
        "z": 0.9567,
        "title": "Analysis of Denoising Techniques for Speckle Noise Removal in Synthetic Aperture Radar Images",
        "citations": 9,
        "doi": "10.1109/ICACCI.2018.8554917",
        "year": 2018,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["Hemani Parikh", "Samir B. Patel", "Vibha Patel"],
        "venue": "International Conference on Advances in Computing, Communications and Informatics",
        "tldr": "Active Synthetic Aperture Radar (SAR) sensors use their own source of illumination to sense the earth surface.",
        "abstract": ""
      },
      {
        "id": "Multiparametric",
        "x": -0.5102,
        "y": -0.7783,
        "z": 1.1333,
        "title": "Multiparametric sea state fields from synthetic aperture radar for maritime situational awareness",
        "citations": 44,
        "doi": "10.1016/j.rse.2022.113200",
        "year": 2022,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["A. Pleskachevsky", "B. Tings", "S. Wiehle", "J. Imber", "S. Jacobsen"],
        "venue": "Remote Sensing of Environment",
        "tldr": "This paper introduces a method for estimating a series of sea state parameters from satellite-borne synthetic aperture radar (SAR).",
        "abstract": ""
      },
      {
        "id": "Remote",
        "x": -0.4041,
        "y": -1.0582,
        "z": 0.8573,
        "title": "Remote Surveillance of Differential Deformation for Kazakhstan Offshore Kashagan Oilfield Using Microwave Satellite Remote Sensing",
        "citations": 0,
        "doi": "10.3390/rs15194754",
        "year": 2023,
        "clusterId": 2,
        "color": "#377EB8",
        "size": 0.2,
        "authors": ["E. Bayramov", "G. Tessari", "M. Kada", "S. Aliyeva", "M. Buchroithner"],
        "venue": "Remote Sensing",
        "tldr": "The primary objective of this study was to assess differential vertical and horizontal deformations for the offshore Kashagan oilfield located in the Northern Caspian Sea.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "3",
    "clusterId": 3,
    "name": "Topic 2: High-Resolution Forest Wat",
    "color": "#4DAF4A",
    "pointCount": 43,
    "centroid": {
      "x": 1.1497,
      "y": -0.4757,
      "z": 1.32
    },
    "points": [
      {
        "id": "Estimation",
        "x": 1.0896,
        "y": -0.6479,
        "z": 1.1694,
        "title": "Estimation of Soil Moisture Applying Modified Dubois Model to Sentinel-1; A Regional Study from Central India",
        "citations": 61,
        "doi": "10.3390/rs12142266",
        "year": 2020,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Abhilasha Singh", "K. Gaurav", "G. Meena", "Shashi Kumar"],
        "venue": "Remote Sensing",
        "tldr": "Surface soil moisture has a wide application in climate change, agronomy, water resources, and in many other domain of science and engineering.",
        "abstract": ""
      },
      {
        "id": "Flood",
        "x": 1.3037,
        "y": -0.5465,
        "z": 1.2954,
        "title": "Flood frequency characterization of the Nhecolândia region (Pantanal) based on high spatial and temporal resolution PlanetScope satellite images",
        "citations": 0,
        "doi": "10.1177/03091333251378968",
        "year": 2025,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Mariana Dias Ramos", "\u00c9. Merino", "C. Montes", "Didier Gastmans", "A. Melfi"],
        "venue": "Progress in Physical Geography: Earth and Environment",
        "tldr": "The study of aquatic systems is becoming increasingly critical due to global concerns about sustainable water resource management.",
        "abstract": ""
      },
      {
        "id": "Recent",
        "x": 1.1889,
        "y": -0.4232,
        "z": 1.3279,
        "title": "Recent wildfires in Central Chile: Detecting links between burned areas and population exposure in the wildland urban interface.",
        "citations": 66,
        "doi": "10.1016/j.scitotenv.2019.135894",
        "year": 2019,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["P. Sarricolea", "Roberto Serrano\u2010Notivoli", "Magdalena Fuentealba", "Marina Hernandez-Mora", "Francisco de la Barrera", "Pamela Smith", "Oliver Meseguer\u2010Ruiz"],
        "venue": "Science of the Total Environment",
        "tldr": "Wildfires are gaining importance in the Mediterranean regions owing to climate change and landscape changes due to the increasing closeness between urban areas and forests prone to wildfires.",
        "abstract": ""
      },
      {
        "id": "Land",
        "x": 1.2178,
        "y": -0.6976,
        "z": 1.1686,
        "title": "Land Surface Temperature Retrieval from Landsat 9 Satellite Data in the Case of Injibara Town and the Surrounding Banja District, Awi Nationality Administrative Zone, Amhara, Ethiopia",
        "citations": 6,
        "doi": "10.23917/forgeo.v39i2.6363",
        "year": 2025,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Minyichil Teshome Kassahun", "N. Workineh"],
        "venue": "Forum Geografic",
        "tldr": "Land surface temperature (LST) is crucial for various applications like agriculture, hydrology, urban planning, and climate analysis.",
        "abstract": ""
      },
      {
        "id": "High",
        "x": 1.2961,
        "y": -0.6499,
        "z": 1.2407,
        "title": "High Spatiotemporal Rugged Land Surface Temperature Downscaling over Saihanba Forest Park, China",
        "citations": 14,
        "doi": "10.3390/rs14112617",
        "year": 2022,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["X. Ouyang", "Youjun Dou", "Jinxin Yang", "Xiangshan Chen", "Jianguang Wen"],
        "venue": "Remote Sensing",
        "tldr": "Satellite-derived rugged land surface temperature (LST) is an important parameter indicating the status of the Earth’s surface energy budget and its seasonal/temporal dynamic change.",
        "abstract": ""
      },
      {
        "id": "Remote",
        "x": 1.2618,
        "y": -0.3645,
        "z": 1.3771,
        "title": "Remote sensing applications for reservoir water level monitoring, sustainable water surface management, and environmental risks in Quang Nam province, Vietnam",
        "citations": 22,
        "doi": "10.2166/WCC.2021.347",
        "year": 2021,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["D. N. Quang", "Nguyen Khanh Linh", "Ho Sy Tam", "N. Viet"],
        "venue": "Academic Conference",
        "tldr": "Monitoring surface water provides vital information in water management; however, limited data is a fundamental challenge for most developing countries, such as Vietnam.",
        "abstract": ""
      },
      {
        "id": "Pengolahan",
        "x": 1.2729,
        "y": -0.3576,
        "z": 1.4401,
        "title": "Pengolahan Geolokasi Produk Data Gas Rumah Kaca (GRK) dari Satelit Suomi NPP ATMS Dan CRIS Dengan Metode Interpolasi Radial Basis Function",
        "citations": 0,
        "doi": "10.30536/J.PJPDCD.2018.V15.A2798",
        "year": 2018,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Andy Indradjad", "Haris Suka Dyatmika", "N. Salyasari", "Liana Fibriawati", "Masnita Indriani"],
        "venue": "Jurnal Penginderaan Jauh dan Pengolahan Data Citra Digital",
        "tldr": "Geolocation processing to produce spatial greenhouse gases data products consisting of CH4, CO2 and N20 gases has been carried out systematically.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 1.251,
        "y": -0.5873,
        "z": 1.2383,
        "title": "A Climate Smart Framework for Forecasting Field-level Potential Evapotranspiration and Irrigation Requirement with Numerical Weather Predictions and Satellite Remote Sensing",
        "citations": 0,
        "doi": "10.5194/egusphere-egu2020-11756",
        "year": 2020,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["D. Tian", "Parisa Asadi", "H. Medina", "B. Ortiz", "Isaya Kesikka"],
        "venue": "Academic Conference",
        "tldr": "In this study, we develop a framework for forecasting ETc and IWR using multi-model numerical weather predictions and harmonized Landsat Sentinel-2 remote sensing product.",
        "abstract": ""
      },
      {
        "id": "MODIS",
        "x": 1.1231,
        "y": -0.3731,
        "z": 1.4862,
        "title": "MODIS aerosol optical depth retrieval based on random forest approach",
        "citations": 14,
        "doi": "10.1080/2150704X.2020.1842540",
        "year": 2020,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Tianchen Liang", "Lin Sun", "Haoxin Li"],
        "venue": "Remote Sensing Letters",
        "tldr": "ABSTRACT Despite significant improvement in Moderate Resolution Imaging Spectroradiometer (MODIS) aerosol optical depth (AOD) retrieval, high-resolution–high-accuracy AOD retrieval remains a challenging task.",
        "abstract": ""
      },
      {
        "id": "High",
        "x": 1.2728,
        "y": -0.3133,
        "z": 1.1559,
        "title": "High resolution satellite data and image segmentation produce accurate benthic substrate maps in clear waters of the great lakes",
        "citations": 2,
        "doi": "10.1007/s12518-025-00607-9",
        "year": 2025,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["James V. Marcaccio", "Jesse Gardner Costa", "S. Parker", "J. Midwood"],
        "venue": "Applied Geomatics",
        "tldr": "Benthic substrates are an important component of fish habitat and preferred substrates vary with species and life history traits.",
        "abstract": ""
      },
      {
        "id": "Unsupervised",
        "x": 0.9639,
        "y": -0.6234,
        "z": 1.4887,
        "title": "Unsupervised Sub-Pixel Water Body Mapping with Sentinel-3 OLCI Image",
        "citations": 35,
        "doi": "10.3390/RS11030327",
        "year": 2019,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Xia Wang", "F. Ling", "H. Yao", "Yaolin Liu", "Shuna Xu"],
        "venue": "Remote Sensing",
        "tldr": "In this paper, an unsupervised sub-pixel water body mapping (USWBM) method was proposed particularly for the Sentinel-3 OLCI image, and it aims to produce a finer spatial resolution (e.g., 30 m) water body map from the multispectral image.",
        "abstract": ""
      },
      {
        "id": "Crop",
        "x": 1.2728,
        "y": -0.3726,
        "z": 1.252,
        "title": "Crop Field Boundary Delineation using Historical Crop Rotation Pattern",
        "citations": 17,
        "doi": "10.1109/Agro-Geoinformatics.2019.8820240",
        "year": 2019,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Md. Shahinoor Rahman", "L. Di", "Zhiqi Yu", "E. Yu", "Junmei Tang", "Li Lin", "Chen Zhang", "Juozas Gaigalas"],
        "venue": "International Conference on Agro-Geoinformatics",
        "tldr": "GIS data layer on crop field boundary has many applications in agricultural research, ecosystem study, crop monitoring, and land management.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.9421,
        "y": -0.6448,
        "z": 1.4227,
        "title": "A Workshop on the Next-Generation Environmental Satellite Constellations",
        "citations": 0,
        "doi": "10.1175/bams-d-19-0349.1",
        "year": 2020,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["A. Rehbein", "Mart\u00edn Rugna", "M. P. Hobouchian", "Anna del Moral", "Steven J. Goodman", "Daniel T. Lindsey", "Janel R. Thomas"],
        "venue": "Bulletin of The American Meteorological Society - (BAMS)",
        "tldr": ") Online Training Resources for Environmental Satellites and the iterative 3D tools for satellite images were presented.",
        "abstract": ""
      },
      {
        "id": "Evaluating",
        "x": 1.2421,
        "y": -0.301,
        "z": 1.0892,
        "title": "Evaluating and improving simulations of diurnal variation in land surface temperature with the Community Land Model for the Tibetan Plateau",
        "citations": 11,
        "doi": "10.7717/peerj.11040",
        "year": 2021,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Xiaogang Ma", "Jiming Jin", "Lingjing Zhu", "Jian Liu"],
        "venue": "PeerJ",
        "tldr": "This study evaluated and improved the ability of the Community Land Model version 5.0 (CLM5.0) in simulating the diurnal land surface temperature (LST) cycle for the whole Tibetan Plateau (TP) by comparing it with Moderate Resolution Imaging Spectroradiometer satellite observations.",
        "abstract": ""
      },
      {
        "id": "Comparison",
        "x": 1.058,
        "y": -0.4692,
        "z": 1.4594,
        "title": "Comparison of Inversion Methods for Maize Canopy Time-Series LAI Based on SupReME Reconstructed Images",
        "citations": 0,
        "doi": "10.13031/ja.15011",
        "year": 2022,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Yan Li", "Jin Huang", "Wanlin Gao", "Jinglei Jia", "Sha Tao", "Yan-zhao Ren", "Xin Liu"],
        "venue": "Journal of the ASABE",
        "tldr": "Highlights          The Sentinel-2 images are reconstructed by the SupReME algorithm to obtain rich spatial features and consistent spectral reflectance.",
        "abstract": ""
      },
      {
        "id": "Prisma",
        "x": 0.9685,
        "y": -0.6807,
        "z": 1.4566,
        "title": "Prisma Products and Applications for Aquatic Ecosystems",
        "citations": 2,
        "doi": "10.1109/IGARSS53475.2024.10641559",
        "year": 2024,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["C. Giardino", "M. Bresciani", "Alice Fabbretto", "A. Pellegrino", "Lodovica Panizza", "Erica Matta", "Federica Braga", "G. Scarpa", "V. Brando"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "The monitoring of water biophysical parameters and the management of aquatic ecosystems are crucial to address the current state of degradation of inland and coastal waters.",
        "abstract": ""
      },
      {
        "id": "How",
        "x": 0.8389,
        "y": -0.4605,
        "z": 1.3759,
        "title": "How does precipitation data influence the land surface data assimilation for drought monitoring?",
        "citations": 32,
        "doi": "10.1016/j.scitotenv.2022.154916",
        "year": 2022,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["K. Gavahi", "P. Abbaszadeh", "H. Moradkhani"],
        "venue": "Science of the Total Environment",
        "tldr": "Unlike other studies that attempted the individual assimilation of these variables, here we propose a multivariate data assimilation framework.",
        "abstract": ""
      },
      {
        "id": "Discrimination",
        "x": 1.0259,
        "y": -0.5911,
        "z": 1.1944,
        "title": "Discrimination of Larch Needle Pest Severity Based on Sentinel-2 Super-Resolution and Spectral Derivatives—A Case Study of Erannis jacobsoni Djak",
        "citations": 5,
        "doi": "10.3390/f16010088",
        "year": 2025,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Guangyou Sun", "Xiaojun Huang", "Ganbat Dashzebeg", "Mungunkhuyag Ariunaa", "Yuhai Bao", "Gang Bao", "Siqin Tong", "Altanchimeg Dorjsuren", "Enkhnasan Davaadorj"],
        "venue": "Forests",
        "tldr": "In recent years, Jas’s Larch Inchworm (Erannis jacobsoni Djak, EJD) outbreaks have frequently occurred in forested areas of Mongolia, causing significant damage to forest ecosystems, and rapid and effective monitoring methods are urgently needed.",
        "abstract": ""
      },
      {
        "id": "SIMULATION",
        "x": 0.9118,
        "y": -0.4309,
        "z": 1.3264,
        "title": "SIMULATION OF MUX CAMERA IMAGES OF THE BRAZIL-CHINA SATELLITE EARTH RESOURCES (CBERS-3)",
        "citations": 1,
        "doi": "10.5194/ISPRSARCHIVES-XXXIX-B5-607-2012",
        "year": 2012,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["G. A. Boggione", "Leila Maria Garcia Fonseca", "S. Bosch-Puig", "F. Ponzoni"],
        "venue": "Academic Conference",
        "tldr": "This work presents a simulation technique for the MUX/CBERS-3.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.9695,
        "y": -0.4027,
        "z": 1.1029,
        "title": "A fusion based land cover classification model using remote sensed images",
        "citations": 5,
        "doi": "10.3233/IDT-210037",
        "year": 2022,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["M. Sahu", "Rasmita Dash"],
        "venue": "International Journal of Intelligent Decision Technologies",
        "tldr": "In this paper, a multiclass land cover classification model is proposed that comprise of pre-processing method, a multiclass classifier and performance evaluation strategy.",
        "abstract": ""
      },
      {
        "id": "Review",
        "x": 1.256,
        "y": -0.2686,
        "z": 1.1576,
        "title": "Review of remote sensing algorithms for monitoring forest disturbance from time series and multi-source data fusion",
        "citations": 17,
        "doi": "10.11834/jrs.20187089",
        "year": 2018,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Wenjuan Shen", "Mingshi Li", "Chengquan Huang"],
        "venue": "National Remote Sensing Bulletin",
        "tldr": ": Spatio-temporally explicit forest disturbance information is regarded as a critical mechanism for net ecosystem productivity.",
        "abstract": ""
      },
      {
        "id": "Study",
        "x": 1.2421,
        "y": -0.3636,
        "z": 1.4297,
        "title": "Study on Forest Fire Diffusion Method Based on Cellular Automata",
        "citations": 1,
        "doi": "10.1109/Geoinformatics60313.2023.10247973",
        "year": 2023,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Tonghe Zhang", "Qingxiang Meng", "Jinchun Liu", "Qifan Liang"],
        "venue": "GEOINFORMATICS",
        "tldr": "The results show that the over-fire area obtained by the simulation experiment is similar to the spatial distribution of the over-fire area extracted by Sentinel-2 satellite, which proves that the cellular automata model constructed in this paper has high accuracy.",
        "abstract": ""
      },
      {
        "id": "Research",
        "x": 1.2872,
        "y": -0.6333,
        "z": 1.2258,
        "title": "Research of the state of forests in the precarpathian region by satellite images using the method of supervised classification",
        "citations": 0,
        "doi": "10.33841/1819-1339-1-47-179-185",
        "year": 2024,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["YU. Petryk", "K. Burshtynska", "B. Polishchuk"],
        "venue": "Modern achievements of geodesic science and industry",
        "tldr": "The purpose of the research is to monitor the forest objects of the Rava-Ruska forestry and determine changes in their areas from 2002 to 2022.",
        "abstract": ""
      },
      {
        "id": "Google",
        "x": 1.3424,
        "y": -0.5739,
        "z": 1.2217,
        "title": "Google earth engine for spatio-temporal drought monitoring in Bangkalan, Indonesia",
        "citations": 5,
        "doi": "10.1051/bioconf/20249905006",
        "year": 2024,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Fahmi Arief Rahman", "Sinar Suryawati", "S. Supriyadi", "Basuki"],
        "venue": "BIO Web of Conferences",
        "tldr": "Drought occurrence in a certain area can be monitored by remote sensing through cloud-based platform of Google Earth Engine (GEE).",
        "abstract": ""
      },
      {
        "id": "Efficient",
        "x": 1.2224,
        "y": -0.3138,
        "z": 1.4892,
        "title": "Efficient Data Collection with an Automated Robotic Helicopter Using Bayesian Adaptive Sampling Algorithms for Control",
        "citations": 1,
        "doi": "10.5772/5821",
        "year": 2008,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["S. Crunk", "Marian Farah"],
        "venue": "Academic Conference",
        "tldr": "We propose a novel data collection technique, called Bayesian Adaptive Sampling (BAS), which enables us to capture maximum information from minimal sample size.",
        "abstract": ""
      },
      {
        "id": "Evaluating",
        "x": 1.2767,
        "y": -0.2881,
        "z": 1.4138,
        "title": "Evaluating MODIS vegetation products using digital images for quantifying local peatland CO2 gas fluxes",
        "citations": 17,
        "doi": "10.1002/rse2.45",
        "year": 2017,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["N. Gatis", "K. Anderson", "E. Grand\u2010Clement", "D. Luscombe", "I. Hartley", "David R. Smith", "R. Brazier"],
        "venue": "Academic Conference",
        "tldr": "In peatlands plant growth and senescence affect annual ecosystem carbon dioxide (CO2) exchange, and CO2 fluxes show considerable inter‐annual variability.",
        "abstract": ""
      },
      {
        "id": "Spatial",
        "x": 0.9041,
        "y": -0.4765,
        "z": 1.3376,
        "title": "Spatial Data Processing Tools and Applications for Black Sea catchment Region",
        "citations": 5,
        "doi": "10.47839/ijc.11.4.575",
        "year": 2012,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["D. Gorgan", "V. B\u00e2cu", "D. Mihon", "D. Rodila", "T. Stefanut", "K. Abbaspour", "P. Cau", "G. Giuliani", "Nicolas Ray", "A. Lehmann"],
        "venue": "Int. J. Comput.",
        "tldr": "The enviroGRIDS project has developed and provides through the BSC-OS portal a set of tools, applications and platforms concerning with the processing of huge spatial data for the Black Sea catchment region.",
        "abstract": ""
      },
      {
        "id": "ANALISIS",
        "x": 1.1965,
        "y": -0.6584,
        "z": 1.2211,
        "title": "ANALISIS KONDISI HUTAN MANGROVE DAN POTENSI SERAPAN KARBON MENGGUNAKAN DATA SENTINEL-2 DI KABUPATEN PESAWARAN",
        "citations": 1,
        "doi": "10.20527/jht.v12i3.20553",
        "year": 2024,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Alfian Zamsami Adirama", "Rizki Dimas Permana", "Achmad Chalid Afif Alfajrin", "Mohamad Ashari Dwiputra", "Nanda Widiya", "Sakti Vincensius Sozanolo Dakhi", "Weni Fira Destina"],
        "venue": "Jurnal Hutan Tropis",
        "tldr": "Climate change and global warming continue to occur up to the present.",
        "abstract": ""
      },
      {
        "id": "Satellite",
        "x": 1.2513,
        "y": -0.2577,
        "z": 1.2907,
        "title": "Satellite imagery for high-throughput phenotyping in breeding plots",
        "citations": 30,
        "doi": "10.3389/fpls.2023.1114670",
        "year": 2023,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Francisco Pinto", "M. Zaman-Allah", "M. Reynolds", "U. Schulthess"],
        "venue": "Frontiers in Plant Science",
        "tldr": "In this communication we present a case study on the use of time series SkySat images to estimate NDVI from wheat and maize breeding plots encompassing different sizes and spacing.",
        "abstract": ""
      },
      {
        "id": "Using",
        "x": 1.2782,
        "y": -0.2982,
        "z": 1.4014,
        "title": "Using RGISTools to Estimate Water Levels in Reservoirs and Lakes",
        "citations": 8,
        "doi": "10.3390/rs12121934",
        "year": 2020,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["A. F. Militino", "Manuel Montesino-SanMartin", "U. P\u00e9rez-Goya", "M. Ugarte"],
        "venue": "Remote Sensing",
        "tldr": "The combination of freely accessible satellite imagery from multiple programs improves the spatio-temporal coverage of remote sensing data, but it exhibits barriers regarding the variety of web services, file formats, and data standards.",
        "abstract": ""
      },
      {
        "id": "Fusion",
        "x": 1.2856,
        "y": -0.3007,
        "z": 1.2519,
        "title": "Fusion of Sentinel-2 and Sentinel-3 Images for Producing Daily Maps of Advected Aerosols at Urban Scale",
        "citations": 1,
        "doi": "10.3390/rs18010116",
        "year": 2025,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["L. Alparone", "Massimo Bianchini", "Andrea Garzelli", "S. Lolli"],
        "venue": "Remote Sensing",
        "tldr": "In this study, the authors wish to introduce an unsupervised procedure designed for real-time generation of maps depicting advected aerosols, specifically focusing on desert dust and smoke originating from biomass combustion.",
        "abstract": ""
      },
      {
        "id": "Harnessing",
        "x": 1.3161,
        "y": -0.334,
        "z": 1.4726,
        "title": "Harnessing the Power of Machine Learning for Mapping of Iron Oxide Mineralization using Sentinel Satellite Spectral Imagery",
        "citations": 0,
        "doi": "10.1109/IBCAST54850.2022.9990084",
        "year": 2022,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Muhammad Ahsan Mahboob", "B. Genc", "Iqra Atif"],
        "venue": "International Bhurban Conference on Applied Sciences and Technology",
        "tldr": "In recent decades, satellite-based mineral exploration has been recognized as one of the most cost-effective and time-efficient tools for regional exploration.",
        "abstract": ""
      },
      {
        "id": "Uncertainty",
        "x": 0.9953,
        "y": -0.7134,
        "z": 1.4412,
        "title": "Uncertainty Quantification in QGIS-Based Satellite Image Analysis",
        "citations": 0,
        "doi": "10.1109/IC2PCT68894.2026.11584386",
        "year": 2026,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Kunal Singh Mandhan", "Lovejeet Patel", "Shion Shibu", "Mukesh Kumar Verma", "S. Kaswan"],
        "venue": "2026 IEEE 6th International Conference on Computing, Power, and Communication Technologies (IC2PCT)",
        "tldr": "The environmental assessment, climate studies, and land management all use satellite-based vegetation monitoring.",
        "abstract": ""
      },
      {
        "id": "Comparison",
        "x": 1.3109,
        "y": -0.2809,
        "z": 1.4528,
        "title": "Comparison of In-Situ Temperature and Satellite Retrieved Temperature in Determining Geothermal Potential in Jaboi Field, Sabang",
        "citations": 5,
        "doi": "10.1088/1742-6596/1116/3/032008",
        "year": 2018,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["D. P. Cesarian", "I. Abir", "M. Isa"],
        "venue": "Journal of Physics, Conference Series",
        "tldr": "Current technological advancement in remote sensing makes it possible to map potential geothermal hotspots for a large area effectively using thermal infrared sensors.",
        "abstract": ""
      },
      {
        "id": "Monitoring",
        "x": 0.8217,
        "y": -0.4953,
        "z": 1.2714,
        "title": "Monitoring Seawater Quality in the Kali Porong Estuary as an Area for Lapindo Mud Disposal leveraging Google Earth Engine",
        "citations": 4,
        "doi": "10.1088/1755-1315/936/1/012011",
        "year": 2021,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["F. Bioresita", "Muhammad Hidayatul Ummah", "M. Wulansari", "Nabilla Aprilia Putri"],
        "venue": "IOP Conference Series: Earth and Environment",
        "tldr": "The hot mudflow released by Lapindo Mud Volcano periodically requires a large storage space.",
        "abstract": ""
      },
      {
        "id": "Land",
        "x": 1.1579,
        "y": -0.5883,
        "z": 1.3518,
        "title": "Land cover classification based optical satellite images using machine learning algorithms",
        "citations": 6,
        "doi": "10.26555/ijain.v8i3.803",
        "year": 2022,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["A. Razafinimaro", "A. R. Hajalalaina", "H. Rakotonirainy", "Reziky Zafimarina"],
        "venue": "International Journal of Advances in Intelligent Informatics",
        "tldr": "In this paper, we examined the performance of DT, SVM, KNN, ANN, and RF.",
        "abstract": ""
      },
      {
        "id": "Enhancing",
        "x": 1.0073,
        "y": -0.4343,
        "z": 1.4753,
        "title": "Enhancing Landsat image based aboveground biomass estimation of black locust with scale bias-corrected LiDAR AGB map and stratified sampling",
        "citations": 15,
        "doi": "10.1080/10095020.2023.2249042",
        "year": 2023,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Shuhong Qin", "Hong Wang", "Xiuneng Li", "Jay Gao", "Jiaxin Jin", "Yongtao Li", "Jinbo Lu", "Pengyu Meng", "Jing Sun", "Zhenglin Song", "Petar Donev", "Zhangfeng Ma"],
        "venue": "Geo-Spatial Information Science",
        "tldr": "ABSTRACT There is a growing interest in leveraging LiDAR-generated forest Aboveground Biomass (LG-AGB) data as a reference to retrieve AGB from satellite observations.",
        "abstract": ""
      },
      {
        "id": "Fast",
        "x": 1.3556,
        "y": -0.6033,
        "z": 1.2736,
        "title": "Fast extraction of winter wheat planting area in Huang-Huai-Hai Plain using high-resolution satellite imagery on a cloud computing platform",
        "citations": 3,
        "doi": "10.25165/j.ijabe.20221501.6917",
        "year": 2021,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Dongyan Zhang", "Mengru Zhang", "Fenfang Lin", "Zhenggao Pan", "Fei Jiang", "Liang He", "Han Yang", "N. Jin"],
        "venue": "International Journal of Agricultural and Biological Engineering",
        "tldr": ": To extract regional winter wheat planting area using higher-resolution satellite imagery still faces many challenges due to large data size and long processing time in traditional remote sensing classification.",
        "abstract": ""
      },
      {
        "id": "Open-Source",
        "x": 1.145,
        "y": -0.3993,
        "z": 1.4575,
        "title": "Open-Source Software for Satellite-Based Crop Health Monitoring",
        "citations": 7,
        "doi": "10.1007/s42853-024-00242-z",
        "year": 2024,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["James Y. Kim"],
        "venue": "Journal of Biosystems Engineering",
        "tldr": "Timely information on agricultural crops is essential to support informed crop management decisions.",
        "abstract": ""
      },
      {
        "id": "Forest",
        "x": 1.0045,
        "y": -0.7031,
        "z": 1.4462,
        "title": "Forest Fire Prediction Using Machine Learning Techniques",
        "citations": 41,
        "doi": "10.1109/CONIT51480.2021.9498448",
        "year": 2021,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["T. Preeti", "Suvarna G. Kanakaraddi", "Aishwarya Beelagi", "Sumalata Malagi", "Aishwarya Sudi"],
        "venue": "2021 International Conference on Intelligent Technologies (CONIT)",
        "tldr": "Forest Fire Prediction is a key component of forest fire control.",
        "abstract": ""
      },
      {
        "id": "Compositing",
        "x": 1.2413,
        "y": -0.4635,
        "z": 1.1431,
        "title": "Compositing the Minimum NDVI for Daily Water Surface Mapping",
        "citations": 38,
        "doi": "10.3390/rs12040700",
        "year": 2020,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Xingwang Fan", "Yuanbo Liu", "Guiping Wu", "Xiaosong Zhao"],
        "venue": "Remote Sensing",
        "tldr": "Capturing high frequency water surface dynamics via optical remote sensing is important for understanding hydro-ecological processes over seasonally flooded wetlands.",
        "abstract": ""
      },
      {
        "id": "Classification",
        "x": 0.8288,
        "y": -0.4006,
        "z": 1.2369,
        "title": "Classification of forests in the precarpathian region using quickbird-2 high resolution satellite image",
        "citations": 0,
        "doi": "10.15576/GLL/2017.2.7",
        "year": 2017,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Andriy Babushka", "K. Burshtynska", "Y. Denys"],
        "venue": "Academic Conference",
        "tldr": "Based on the study of literature on the classification of forests using high resolution space images it was established that the separation of classes and classes close to the spectral brightness can not be identified with high accuracy.",
        "abstract": ""
      },
      {
        "id": "Meteorological",
        "x": 1.2407,
        "y": -0.6701,
        "z": 1.2297,
        "title": "Meteorological Analysis of Extreme Fires in Albania during the Period 2019–2025",
        "citations": 0,
        "doi": "10.9734/jgeesi/2025/v29i12983",
        "year": 2025,
        "clusterId": 3,
        "color": "#4DAF4A",
        "size": 0.2,
        "authors": ["Gazmir \u00c7ela", "Anira Gjoni", "Alban Doko", "F. Kadria", "Indrit Rexhepi", "O. Jaupaj"],
        "venue": "Journal of Geography Environment and Earth Science International",
        "tldr": "This study investigates the relationship between weather conditions and extreme fires in Albania during 2019–2025, aiming to assess the impact of atmospheric conditions on the occurrence, intensity, and spatial distribution of forest fires.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "4",
    "clusterId": 4,
    "name": "Topic 3: Land Cover Change Detectio",
    "color": "#984EA3",
    "pointCount": 27,
    "centroid": {
      "x": -2.4273,
      "y": 0.3353,
      "z": -0.519
    },
    "points": [
      {
        "id": "Historical",
        "x": -2.2712,
        "y": 0.0813,
        "z": -0.6795,
        "title": "Historical urban growth, land surface temperature dynamics, and future land use and land cover projections in the Metropolitan Region of Vale do Aço",
        "citations": 0,
        "doi": "10.1007/s00704-026-06477-4",
        "year": 2026,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["P. Goncalves", "Arthur Amaral e Silva", "B. Marangon", "Edson Soares Fialho"],
        "venue": "Theoretical and Applied Climatology",
        "tldr": "Changes in Land Use and Land Cover (LULC), especially those associated with the urbanization process, play a fundamental role in intensifying phenomena such as heat islands.",
        "abstract": ""
      },
      {
        "id": "Mapping",
        "x": -2.4502,
        "y": 0.4747,
        "z": -0.4077,
        "title": "Mapping Impacts of Crude Oil theft and Illegal Refineries on Mangrove of the Niger Delta of Nigeria with Remote Sensing Technology",
        "citations": 17,
        "doi": "10.5901/MJSS.2015.V6N3P150",
        "year": 2015,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["T. F. Balogun"],
        "venue": "Academic Conference",
        "tldr": "Niger Delta is the oil rich region of Nigeria where extensive mangrove form one of the most important ecosystems of coastal and marine areas.",
        "abstract": ""
      },
      {
        "id": "Mangrove",
        "x": -2.6348,
        "y": 0.345,
        "z": -0.5576,
        "title": "Mangrove Management Information System in Southern Coast of Malang Indonesia Using Trend Moment Method",
        "citations": 0,
        "doi": "10.24857/rgsa.v19n5-009",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Gisanda Aliya Ramadhanty", "Erfan Rohadi", "Cahya Rahmad", "Nia Ambarsari", "P. Resmi", "Faqih Hamami"],
        "venue": "Revista de Gestão Social e Ambiental",
        "tldr": "Objective: The objective of this study is to investigate mangrove changes using satellite image from 2018 to 2023, then compared with in situ data in 2024 with the aim of developing an information system on mangrove vegetation of 18 beaches in Southern Coast of Malang, East Java, Indonesia.",
        "abstract": ""
      },
      {
        "id": "Deforestation",
        "x": -2.5066,
        "y": 0.3446,
        "z": -0.4733,
        "title": "Deforestation Monitoring in Different Brazilian Biomes: Challenges and Lessons",
        "citations": 4,
        "doi": "10.1109/LAGIRS48042.2020.9285976",
        "year": 2020,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["C. Almeida", "D. Valeriano", "L. Maurano", "L. Vinhas", "L. Fonseca", "D. Silva", "C. P. Santos", "F. Martins", "F. C. Lara", "J. S. Maia", "E. R. Profeta", "L. O. Santos", "F. Santos", "V. Ribeiro"],
        "venue": "2020 IEEE Latin American GRSS & ISPRS Remote Sensing Conference (LAGIRS)",
        "tldr": "In this article, we present some aspects of the evolution of this methodology, the key processes to produce accurate deforestation maps during the last 30 years and the new challenges that the Project would face.",
        "abstract": ""
      },
      {
        "id": "Assessment",
        "x": -2.1479,
        "y": 0.1635,
        "z": -0.5211,
        "title": "Assessment of the agricultural soil use by remote sensing (Perm Region, on the example of LLC “Krona-Agro”)",
        "citations": 0,
        "doi": "10.31862/2500-2961-2020-10-1-76-96",
        "year": 2020,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["A. Chashchin", "Vladimir P. Zhizhilev"],
        "venue": "Academic Conference",
        "tldr": "For rapid and accurate assessment of the agricultural soil use it is effective to use remote sensing methods.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": -2.3063,
        "y": 0.3798,
        "z": -0.8335,
        "title": "Análise das modificações ambientais decorrentes da ocupação urbana em Rio Grande, RS, entre 1947 e 2014, por meio de um Sistema de Informações Geográficas",
        "citations": 3,
        "doi": "10.5380/DMA.V38I0.46902",
        "year": 2016,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Giuliana Andr\u00e9ia Sfredo", "C. R. Tagliani"],
        "venue": "Academic Conference",
        "tldr": "This study aims to map and describe the environmental modifications occurred in the coastal city of Rio Grande, RS, between 1947 and 2014, resulting from the urbanization process whereby the municipality passed during the analyzed period.",
        "abstract": ""
      },
      {
        "id": "Habitat",
        "x": -2.4383,
        "y": 0.0628,
        "z": -0.587,
        "title": "Habitat Fragmentation by Land-Use Change: One-Horned Rhinoceros in Nepal and Red-Cockaded Woodpecker in Texas",
        "citations": 0,
        "doi": "10.12794/metadc33207",
        "year": 2010,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["V. Thapa"],
        "venue": "Academic Conference",
        "tldr": "This research focuses on the spatial analysis of the habitat of two vulnerable species, the one-horn rhinoceros in the grasslands of southern Nepal, and the red-cockaded woodpecker in the Piney woods of southeast Texas, in the USA.",
        "abstract": ""
      },
      {
        "id": "Transformations",
        "x": -2.2026,
        "y": 0.512,
        "z": -0.3556,
        "title": "Transformations of Vernacular Geographies: Changes in the Morphology of Residential Areas of Sentani in Indonesia",
        "citations": 0,
        "doi": "10.61275/isvsej-2024-11-04-03",
        "year": 2024,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Anriani Safar", "Idawarni J.", "Asmal", "E. Syarif", "A. Radja"],
        "venue": "ISVS e journal",
        "tldr": "Sentani is a city in Indonesia.",
        "abstract": ""
      },
      {
        "id": "Assessment",
        "x": -2.6455,
        "y": 0.3556,
        "z": -0.6262,
        "title": "Assessment of vegetation trend changes in the wild savannah-protected area of Mid Zambezi Valley",
        "citations": 4,
        "doi": "10.1080/27658511.2025.2542186",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Jeremiah Chakuya", "Manuel Ndebele"],
        "venue": "Sustainability in Environment",
        "tldr": "ABSTRACT Observations in the Zambezi Valley indicate vegetation loss caused by wildlife, mainly elephants, and natural vegetation die-offs.",
        "abstract": ""
      },
      {
        "id": "Environmental",
        "x": -2.4934,
        "y": 0.1737,
        "z": -0.4319,
        "title": "Environmental Assessment For Mapping Land Degradation and Lands Changes Using Remotely Sensed Data with Geospatial Analysis",
        "citations": 2,
        "doi": "10.22399/ijcesen.1045",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["G. Saba", "Yousef", "Hayder Dibs", "A. Naje"],
        "venue": "International Journal of Computational and Experimental Science and Engineering",
        "tldr": "Lands degradation is one of the problems that facing the humanity throughout the world as well as the abandonment of farming on their lands by farmers, in addition to the fragmentation of most orchards and agricultural fields and their conversion into residential areas, has a negative impact on the Economic, Environmental and Social (Reduced Agricultural Productivity, Economic Loss, Soil Degradation, Agricultural productivity.",
        "abstract": ""
      },
      {
        "id": "Effects",
        "x": -2.5564,
        "y": 0.2218,
        "z": -0.3419,
        "title": "Effects of Climate Change, Land Use and Land Cover Variability on Green and Blue Water in Wami/Ruvu Basin, Tanzania",
        "citations": 5,
        "doi": "10.4314/tjs.v49i1.22",
        "year": 2023,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Benson HM Lazaro", "M. Hagai", "R. Mato"],
        "venue": "Tanzania Journal of Science",
        "tldr": "Water basins are the primary food sources, giving green water and blue water worldwide.",
        "abstract": ""
      },
      {
        "id": "The",
        "x": -2.2014,
        "y": 0.5115,
        "z": -0.5767,
        "title": "The use of MCDA in forest health risk assessment for an effective geoenvironmental management of Divjake Karavasta National Park",
        "citations": 0,
        "doi": "10.33422/icarss.v2i1.1036",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["E. Begu", "S. Sinjari", "Romeo Hanxhari", "Xhulia Bygjymi", "D. Prifti"],
        "venue": "Proceedings of the International Conference on Advanced Research in Social Sciences",
        "tldr": "Forest health refers to the overall ecological and functional condition of a forest, which affects its ability to support biodiversity, regulate the climate and provide natural resources for people and the surrounding environment.",
        "abstract": ""
      },
      {
        "id": "Forest",
        "x": -2.4264,
        "y": 0.4192,
        "z": -0.319,
        "title": "Forest Belts in the Dry Steppes of the Altai Region: Assessment of the Current State",
        "citations": 0,
        "doi": "10.18384/2712-7621-2025-1-6-26",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["A. A. Shigimaga", "N. I. Bykov", "N. Rygalova"],
        "venue": "Geographical Environment and Living Systems",
        "tldr": "Assessment of the state of forest shelterbelts in the dry-steppe subzone of the Altai Territory and identification of key factors contributing to their degradation and area reduction.Methodology.",
        "abstract": ""
      },
      {
        "id": "Pemetaan",
        "x": -2.5247,
        "y": 0.0922,
        "z": -0.3173,
        "title": "Pemetaan Temporal Perubahan Penggunaan Lahan Kelapa Sawit di Kecamatan Babulu, Penajam Paser Utara",
        "citations": 0,
        "doi": "10.30872/jatl.8.1.2025.19541.49-55",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Yudiansyah Yudiansyah", "Yoga Toyibulah"],
        "venue": "Jurnal Agroekoteknologi Tropika Lembab",
        "tldr": "Babulu District in Penajam Paser Utara Regency, East Kalimantan, is an area with high potential in the development of oil palm plantations.",
        "abstract": ""
      },
      {
        "id": "Rock",
        "x": -2.6201,
        "y": 0.4516,
        "z": -0.6014,
        "title": "Rock type discrimination using Landsat-8 OLI satellite data in mafic-ultramafic terrain",
        "citations": 2,
        "doi": "10.7494/geol.2023.49.3.281",
        "year": 2023,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["K. Tamilarasan", "S. Anbazhagan", "S. Ranjithkumar"],
        "venue": "Geology Geophysics & Environment",
        "tldr": "The mafic-ultramafic terrain of the Bhavani complex in southern India is considered for lithological mapping.",
        "abstract": ""
      },
      {
        "id": "Estudio",
        "x": -2.2555,
        "y": 0.3154,
        "z": -0.4512,
        "title": "Estudio de bofedales en los Andes ecuatorianos a través de la comparación de imágenes Landsat-8 y Sentinel-2",
        "citations": 14,
        "doi": "10.4995/RAET.2019.11715",
        "year": 2019,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Carlos Jara", "J. Delegido", "J. Ayala", "P. Lozano", "A. Armas", "V. Flores"],
        "venue": "Revista de Teledetección",
        "tldr": "The objective of the present study was to compare the Landsat-8 and Sentinel-2 images to calculate the wetland´s extension, distribution and degree of conservation, in Reserva de Producción de Fauna Chinborazo (RPFCH) protected area located in the Andean region of Ecuador.",
        "abstract": ""
      },
      {
        "id": "Sandy",
        "x": -2.4167,
        "y": 0.1852,
        "z": -0.4198,
        "title": "Sandy soil spots in northwestern Paraná: approaches for identification and quantification",
        "citations": 0,
        "doi": "10.20502/rbg.v25i4.2614",
        "year": 2024,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["L. Santos", "Jos\u00e9 Guilherme Oliveira", "F. Breunig", "Marcia Regina Calegari", "Elias Fernando Berra", "Jonez Fidalski"],
        "venue": "Revista Brasileira de Geomorfologia",
        "tldr": "The predominance of sandy soils in the Northwest region of the state of Paraná, associated with the removal of natural vegetation, favored the development of patches of white sand on the surface without any aggregation.",
        "abstract": ""
      },
      {
        "id": "Environmental",
        "x": -2.268,
        "y": 0.513,
        "z": -0.7339,
        "title": "Environmental, demographic and policy drivers of change in mediterranean hedgerow landscape (Central Spain)",
        "citations": 4,
        "doi": "10.1016/J.LANDUSEPOL.2021.105342",
        "year": 2021,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["F. A. Alvarez", "G. Mediavilla", "N. L. Est\u00e9banez"],
        "venue": "Academic Conference",
        "tldr": "Abstract The present paper combines the classification of hedgerows in relation to surface soil moisture with the consideration of drivers of change (environmental, demographic, and policy) affecting the areal extent of hedgerow land cover in central Spain.",
        "abstract": ""
      },
      {
        "id": "Impacts",
        "x": -2.6222,
        "y": 0.4838,
        "z": -0.5816,
        "title": "Impacts of Urbanization Rate and Land Cover Change on Urban Farm Land: A Case of Wolayta Zone Sodo Zuria Woreda",
        "citations": 1,
        "doi": "10.7176/cer/13-3-03",
        "year": 2021,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Bereket Geberselassie Assa"],
        "venue": "Civil and environmental research",
        "tldr": "The effect of human intervention on the agricultural system has shown food insecurity with an increase in the cost of crop production in the local market due to the expansion of urbanization in the study area with 2.66% in 9 years for the demand of residential land.",
        "abstract": ""
      },
      {
        "id": "Avalia",
        "x": -2.5696,
        "y": 0.1155,
        "z": -0.3589,
        "title": "Avaliação da precipitação estimada por sensor orbital no Pantanal Mato-Grossense",
        "citations": 3,
        "doi": "10.26848/RBGF.V14.5.P2700-2710",
        "year": 2021,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Yngrid Nantes Henriques Schuartz", "Victor Hugo de Moraes Danelichen", "Osvaldo Alves Pereira", "Raymerson Rodrigues da Silva"],
        "venue": "Academic Conference",
        "tldr": "Neste trabalho foi realizada uma analise comparativa entre dados de precipitacao observados e dados de precipitacao estimados pelo satelite TRMM, com o objetivo de avaliar a eficiencia da precipitacao estimada pelo sensor orbital em tres sitios experimentais do bioma Pantanal mato-grossense localizadas proximas a Reserva Particular do Patrimonio Natural (RPPN) Sesc Pantanal, no municipio de Barao de Melgaco, considerada a maior reserva particular natural do Brasil, distante 160 km de Cuiaba, MT.",
        "abstract": ""
      },
      {
        "id": "GEOTECNOLOGIAS",
        "x": -2.2936,
        "y": 0.4278,
        "z": -0.6607,
        "title": "GEOTECNOLOGIAS NO DIAGNÓSTICO DE CONFLITOS DE USO DO SOLO DE UMA MICROBACIA DO MUNICÍPIO DE ALTA FLORESTA - MT",
        "citations": 5,
        "doi": "10.5902/1980509819619",
        "year": 2015,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Emanoel Junior da Silva Nunes", "E. Silva", "Eliana Barbosa de Souza", "J. D. R. Filho", "D. Silva"],
        "venue": "Academic Conference",
        "tldr": "The purpose of this study is to use geotechnology in mapping the soil cover and diagnose conflicts of land use in permanent preservation areas (PPA) for a microbasin with an area of ​​17,759 ha located in the municipality of Alta Floresta, in Mato Grosso State.",
        "abstract": ""
      },
      {
        "id": "Impact",
        "x": -2.2978,
        "y": 0.4999,
        "z": -0.7237,
        "title": "Impact of Atmospheric Correction on Land Cover Classification of the Topographic Chart  SC-24-V-C (Petrolina) Using Google Earth Engine and Landsat-8 images",
        "citations": 0,
        "doi": "10.11137/2019_2_100_116",
        "year": 2019,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["K. A. Ganem", "G. Baptista", "W. F. Rocha", "R. N. Vasconcellos", "M. Rosa", "D. T. M. Souza"],
        "venue": "Anuário do Instituto de Geociências",
        "tldr": "It is known that mapping land cover through remote sensing techniques is not a trivial procedure and it requires a high level of knowledge of the processing techniques adopted.",
        "abstract": ""
      },
      {
        "id": "Evoluci",
        "x": -2.2975,
        "y": 0.529,
        "z": -0.6705,
        "title": "Evolución del delta del río Paraná y su posible vinculación con el calentamiento global",
        "citations": 13,
        "doi": "10.22179/REVMACN.15.181",
        "year": 2013,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["R. A. Medina", "J. Codignotto"],
        "venue": "Academic Conference",
        "tldr": "Evolution of the Parana River Delta and its possible relationship to Global warming.",
        "abstract": ""
      },
      {
        "id": "INFORMA",
        "x": -2.4712,
        "y": 0.4009,
        "z": -0.471,
        "title": "INFORMAÇÕES GEOLÓGICO-GEOMORFOLÓGICAS COMO SUBSÍDIOS À ANÁLISE AMBIENTAL: O EXEMPLO DA PLANÍCIE COSTEIRA DE CARAVELAS - BAHIA",
        "citations": 19,
        "doi": "10.5380/GEO.V51I0.4167",
        "year": 2002,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Ana Cl\u00e1udia da Silva Andrade"],
        "venue": "Academic Conference",
        "tldr": "A zona costeira de Caravelas, situada no extremo sul da Bahia, apresenta ricos ecossistemas terrestres e aquaticos, incluindo o complexo recifal dos Abrolhos, considerado o mais importante do Atlântico Sul Ocidental.",
        "abstract": ""
      },
      {
        "id": "Urbanization",
        "x": -2.6456,
        "y": 0.3708,
        "z": -0.5023,
        "title": "Urbanization: A Catalyst for the Emergence of Squatter Settlements and Squalor in the Vicinities of the Federal Capital City of Nigeria",
        "citations": 21,
        "doi": "10.5539/JSD.V8N2P134",
        "year": 2015,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["Opeyemi A. Zubair", "L. M. Ojigi", "R. Mbih"],
        "venue": "Academic Conference",
        "tldr": "From the 1990s to date, growing deterioration of urban environmental quality, and the developments of squatter settlements and squalors have gradually become the attributes of the development patterns in the Federal Capital City (FCC), Abuja and environs in Nigeria.",
        "abstract": ""
      },
      {
        "id": "Interactive",
        "x": -2.273,
        "y": 0.3084,
        "z": -0.3458,
        "title": "Interactive community-based tropical forest monitoring using emerging technologies",
        "citations": 3,
        "doi": "10.18174/357908",
        "year": 2015,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["A. Pratihast"],
        "venue": "Academic Conference",
        "tldr": "Forests cover approximately 30% of the Earth’s land surface and have played an indispensable role in the human development and preserving natural resources.",
        "abstract": ""
      },
      {
        "id": "Land",
        "x": -2.7,
        "y": 0.3145,
        "z": -0.463,
        "title": "Land Degradation Detection in Urban Areas Using Spatial Modelling and Semi-Automatic Classification of Satellite Imagery Data",
        "citations": 2,
        "doi": "10.53623/tasp.v5i2.775",
        "year": 2025,
        "clusterId": 4,
        "color": "#984EA3",
        "size": 0.2,
        "authors": ["R. Purnamasari", "M. Setiawan", "Wardah Wardah"],
        "venue": "Tropical Aquatic and Soil Pollution",
        "tldr": "Urban land degradation poses a growing challenge in rapidly developing countries like Indonesia, where population growth and limited space drive uncontrolled land cover changes.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "5",
    "clusterId": 5,
    "name": "Topic 4: Flood Impact on Soil Areas",
    "color": "#FF7F00",
    "pointCount": 29,
    "centroid": {
      "x": 0.0679,
      "y": -1.4205,
      "z": -1.5151
    },
    "points": [
      {
        "id": "Photogrammetric",
        "x": 0.1128,
        "y": -1.617,
        "z": -1.5805,
        "title": "Photogrammetric Techniques and UAV for Drainage Pattern and Overflow Assessment in Mountainous Terrains - Hatta/UAE",
        "citations": 2,
        "doi": "10.1109/IGARSS.2019.8898151",
        "year": 2019,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["S. Almansoori", "R. Al-Ruzouq", "Diena Al Dogom", "M. Al Shamsi", "Alya Al Mazzm", "N. Aburaed"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "Accurate and precise spatial hydrologic information is essential for effective management of natural resources, planning, and disaster response.",
        "abstract": ""
      },
      {
        "id": "Methodology",
        "x": 0.292,
        "y": -1.4208,
        "z": -1.6624,
        "title": "Methodology of mapping of historical and cultural heritage objects by GIS technologies using archival cartographic and aerial materials",
        "citations": 1,
        "doi": "10.33841/1819-1339-1-41-97-103",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["B. Chetverikov", "O. Khintsitsky", "I. Kalynych"],
        "venue": "Academic Conference",
        "tldr": "The purpose of the work is to process archival cartographic materials and remote sensing data for the interpretation of objects of historical and cultural heritage (OHCH) of Cherkasy, including those that have not been preserved.",
        "abstract": ""
      },
      {
        "id": "Large-scale",
        "x": 0.0656,
        "y": -1.288,
        "z": -1.7367,
        "title": "Large-scale geomorphological mapping of the Malaya Sosva  state nature reserve",
        "citations": 0,
        "doi": "10.47148/1609-364x-2021-2-59-66",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["A. Pshenichnikov", "Konstantin Dektjarev"],
        "venue": "Geoinformatika",
        "tldr": "The Malaya Sosva State Nature Reserve is situated in the west of the Khanty-Mansiysk Au-tonomous Region — Ugra.",
        "abstract": ""
      },
      {
        "id": "GEOINFORMATION",
        "x": 0.309,
        "y": -1.2599,
        "z": -1.4828,
        "title": "GEOINFORMATION MAPPING OF ANTHROPOGENICALLY TRANSFORMED LANDSCAPES OF BILA TSERKVA (UKRAINE)",
        "citations": 7,
        "doi": "10.15576/asp.fc/2022.21.1.69",
        "year": 2022,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["V. Belenok", "L. Hebryn-Baidy", "N. B\u0456elousova", "H. Zavarika", "O. Sakal", "Andriy Kovalenko"],
        "venue": "Acta Scientiarum Polonorum. Formatio Circumiectus",
        "tldr": "Aim of the study: The main purpose of the study is the analysis and assessment of anthropogenically transformed landscapes of Bila Tserkva (Ukraine) based on a combination of remote sensing methods and GIS mapping Material and methods: Usage of geoinformatics methods for mapping anthropogenically transformed landscapes of Bila Tserkva is studied.",
        "abstract": ""
      },
      {
        "id": "GEODESY",
        "x": 0.2266,
        "y": -1.4208,
        "z": -1.4382,
        "title": "GEODESY, CARTOGRAPHY AND AERIAL PHOTOGRAPHY",
        "citations": 4,
        "doi": "10.23939/istcgcap2022.95.077",
        "year": 2022,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["I. Kalynych", "Mariya Nychvyd", "I. Prodanets", "N. Kablak", "Yaroslav Vash"],
        "venue": "GEODESY CARTOGRAPHY AND AERIAL PHOTOGRAPHY",
        "tldr": "This article is devoted to the study of geodynamic processes in the Tysza River basin within the Transcarpathian region with an analysis of geodetic observations obtained over the past decade.",
        "abstract": ""
      },
      {
        "id": "Hydro-morphodynamic",
        "x": 0.2431,
        "y": -1.5483,
        "z": -1.4814,
        "title": "Hydro-morphodynamic modelling in Mediterranean storms – errors and uncertainties under sharp gradients",
        "citations": 30,
        "doi": "10.5194/NHESS-14-2993-2014",
        "year": 2014,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["A. Sanchez-arcilla", "M. Garc\u00eda-Le\u00f3n", "V. Gracia"],
        "venue": "Academic Conference",
        "tldr": "This paper deals with the limits in hydrodynamic and morphodynamic predictions for semi-enclosed coastal domains subject to sharp gradients (in bathymetry, topography, sediment transport and coastal damages).",
        "abstract": ""
      },
      {
        "id": "Above",
        "x": -0.1554,
        "y": -1.3024,
        "z": -1.5828,
        "title": "Above the Impact Zone: Aerial Imaging with AI-Based Rapid Flood Inundation Assessment Using EXIF-Tagged Imagery and Drone-to-Satellite Comparison",
        "citations": 0,
        "doi": "10.65138/ijprse.2026.v7i05.1293",
        "year": 2026,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Vee Jay S. Lee", "Aira Mae L. Marcelo", "Lorenz S. Trinidad", "Kennedy V. Rodriguez", "Reynaldo L. De Asis"],
        "venue": "International Journal of Progressive Research in Science and Engineering",
        "tldr": "Flood assessment in local disaster response is often delayed by limited access to inundated areas and reliance on ground-based observation.",
        "abstract": ""
      },
      {
        "id": "SPATIAL",
        "x": 0.1786,
        "y": -1.5841,
        "z": -1.5073,
        "title": "SPATIAL ANALYSIS OF THE FLOODED LAND AREA OF THE KHERSON REGION NATURE RESERVE USING REMOTE SENSING DATA",
        "citations": 3,
        "doi": "10.17721/1728-2713.109.14",
        "year": 2025,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["\u0406. Stakhiv", "V. Zatserkovnyi", "Mauro De Donatis", "T. Pastushenko", "S. Hordiichuk", "T. Malik"],
        "venue": "Visnyk of Taras Shevchenko National University of Kyiv. Geology",
        "tldr": "The ongoing war in Ukraine has become the largest armed conflict in the world in the last decade, causing unprecedented destruction and devastation of the country's natural landscapes.",
        "abstract": ""
      },
      {
        "id": "To",
        "x": -0.0089,
        "y": -1.5945,
        "z": -1.5148,
        "title": "To the question of the environmental education: how Landsat TM, ETM+ and MSS images can be processed by GIS-techniques for geospatial research",
        "citations": 3,
        "doi": "10.6084/M9.FIGSHARE.7211600",
        "year": 2015,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Polina Lemenkova"],
        "venue": "Academic Conference",
        "tldr": "The emphasis of this research is to demonstrate application of Landsat satellite imagery as a major resource for student and educational research.",
        "abstract": ""
      },
      {
        "id": "Groundwater",
        "x": -0.1998,
        "y": -1.4363,
        "z": -1.5267,
        "title": "Groundwater Complexity in Urban Catchments: Shenzhen, Southern China",
        "citations": 13,
        "doi": "10.1111/gwat.12935",
        "year": 2019,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["M. Lancia", "C. Zheng", "Xin He", "D. Lerner", "C. Andrews"],
        "venue": "Ground Water",
        "tldr": "Groundwater interactions with surface water and sewers in an urban setting are complex, and classic hydrogeological approaches must be combined with anthropogenic elements to characterize them.",
        "abstract": ""
      },
      {
        "id": "Assessment",
        "x": 0.0741,
        "y": -1.3844,
        "z": -1.802,
        "title": "Assessment of Environmental Changes of Valley of the Undytkan River in Impact Zone of the Elginsky Coal Complex and the Railway Track “Ulak- Elga” with Use of Ground and Remote Methods",
        "citations": 1,
        "doi": "10.1088/1755-1315/666/6/062034",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["D. Pinigin", "N. Nikolaeva", "D. D. Nogovitsyn"],
        "venue": "Academic Conference",
        "tldr": "Environmental monitoring studies are of primary importance to assess the characteristics of anthropogenic changes in the environment on the territory of the Elginsky coking coal deposit, which is one of the largest resource potential of the Republic of Sakha (Yakutia).",
        "abstract": ""
      },
      {
        "id": "Flood",
        "x": 0.3177,
        "y": -1.5473,
        "z": -1.5048,
        "title": "Flood hazard assessment in large plain basins with a scarce slope in the Pampean Plain, Argentina",
        "citations": 11,
        "doi": "10.1007/s10661-021-08988-1",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["G. Borzi", "A. Roig", "C. Tanjal", "L. Santucci", "Macarena Tejada Tejada", "E. Carol"],
        "venue": "Environmental Monitoring & Assessment",
        "tldr": "Floods are one of the most common natural phenomena and represent a serious hazard when they affect human activities.",
        "abstract": ""
      },
      {
        "id": "Mapping",
        "x": 0.012,
        "y": -1.4773,
        "z": -1.2661,
        "title": "Mapping and Zoning of Flood Hazard: Case Study of the Ouad Lahdar Valley at the Meknassa Al Gharbiya Territorial Center, Upper Inaouene, Morocco (Application of the Hydrogeomorphological Method)",
        "citations": 0,
        "doi": "10.59573/emsj.8(2).2024.43",
        "year": 2024,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Hamid Fattasse", "Jaouad Gartet", "M. Makhchane", "Marouane Laaraj", "Kamal Lahrichi", "A. Okacha"],
        "venue": "European Modern Studies Journal",
        "tldr": "The present study aims to map flood hazard in the Ouad valley, specifically focusing on the Meknassa El Gharbiya Territorial Center (the downstream part of the Ouad Lahdar watershed).",
        "abstract": ""
      },
      {
        "id": "Utilization",
        "x": -0.0678,
        "y": -1.3455,
        "z": -1.6671,
        "title": "Utilization of Satellite Imagery and Integration of the HVSR Inversion Method for Coastline Changes in the Nangai Beach Tourism Area, North Bengkulu Regency",
        "citations": 1,
        "doi": "10.14710/buloma.v14i3.68258",
        "year": 2025,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Putri Helinnes", "A. Hadi", "M. Farid", "Yuni Setyowati", "Debi Hardiansa", "Usman Gumanty", "Hana Raihana", "A. Al-Ansory", "Zaky Muammar"],
        "venue": "BULETIN OSEANOGRAFI MARINA",
        "tldr": "This research analyzes shoreline changes in the Nangai Beach area; North Bengkulu Regency using Satellite Image data and analyzes subsurface structures using the Horizontal to Vertical Spectral Ratio (HVSR) method.",
        "abstract": ""
      },
      {
        "id": "Aperiodic",
        "x": -0.0184,
        "y": -1.5239,
        "z": -1.3121,
        "title": "Aperiodic embayed sandy beach rotation and erosion-risk exposure on a hyper-muddy wave-exposed coast",
        "citations": 0,
        "doi": "10.5194/egusphere-egu2020-10487",
        "year": 2020,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["E. Anthony", "A. Gardel", "Morgane Jolivet", "G. Brunier", "F. Dolique"],
        "venue": "Academic Conference",
        "tldr": "<p><span>The 1500 km-long wave-exposed coast of the Guianas, South America, is characterized at any time by up to 20+ large distinct mud banks with suspended mud concentrations of up to 1000 g/l migrating from the Amazon delta to the Orinoco delta under the influence of wave-driven longshore transport.",
        "abstract": ""
      },
      {
        "id": "Detection",
        "x": 0.1002,
        "y": -1.5555,
        "z": -1.4985,
        "title": "Detection of the Change in the Morphology of the Courses of the River Ganga Using Satellite-derived Data: A Case Study Area",
        "citations": 1,
        "doi": "10.31305/rrijm.2021.v06.i12.014",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Mukesh Kumar", "A. R. Siddiqui"],
        "venue": "RESEARCH REVIEW International Journal of Multidisciplinary",
        "tldr": "This study seeks to examine the detection of course change in one of the major rivers of India, that is the Ganga, between the period of 1980 to 2020 and utilizes satellite driven data to demonstrate the visibility of shifting in its course.",
        "abstract": ""
      },
      {
        "id": "Arazi",
        "x": 0.2876,
        "y": -1.5458,
        "z": -1.4851,
        "title": "Arazi Kullanımdaki Zamansal Değişimin Kıyı Kenar Çizgisi ve Mülkiyet Açısından Değerlendirilmesi: Erzin İlçesi Örneği",
        "citations": 0,
        "doi": "10.31590/ejosat.956465",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Faz\u0131l Nacar"],
        "venue": "European Journal of Science and Technology",
        "tldr": "Coasts are places where sectors such as settlement, transportation, tourism and trade are intensely carried out by their natural resources and people.",
        "abstract": ""
      },
      {
        "id": "Application",
        "x": 0.0427,
        "y": -1.5002,
        "z": -1.7034,
        "title": "Application and research of GIS intelligent environmental protection Internet of things system construction technology",
        "citations": 3,
        "doi": "10.1109/ITCA49981.2019.00014",
        "year": 2019,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Yunli Cheng", "Linling Zhao"],
        "venue": "2019 International Conference on Information Technology and Computer Application (ITCA)",
        "tldr": "the wisdom of this project is based on GIS environmental iot system building technical application and research, is the use of geographic space information technology, satellite remote sensing technology, global satellite positioning technology, radio frequency identification technology, based on the electronic map, image data, which is based on Internet, metropolitan area network, or LAN, in different spatial location of environmentally friendly iot devices intuitive visual control, intelligent identification, location and tracking, monitoring, alarm, inspection and maintenance of various environmental iot information flow, gathering and processing and statistical analysis, system management and comprehensive application of socialized service system.",
        "abstract": ""
      },
      {
        "id": "Hydrological",
        "x": -0.2674,
        "y": -1.3824,
        "z": -1.4747,
        "title": "Hydrological Modeling of Murray River Basin Using The Hydrological Simulation Program-FORTRAN Model",
        "citations": 1,
        "doi": "10.1109/ICSPC47137.2019.9068009",
        "year": 2019,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Salimeh Malekpour Heydari", "T. N. M. Aris", "R. Yaakob", "H. Hamdan"],
        "venue": "IEEE Conference on Systems, Process and Control",
        "tldr": "Snow Water Equivalent can be a field for modeling runoff in mountainous catchments.",
        "abstract": ""
      },
      {
        "id": "Morphometric",
        "x": 0.0151,
        "y": -1.5531,
        "z": -1.5978,
        "title": "Morphometric and Structural Evaluations of Satellite Data from the Bosumtwi Impact Structure and Adjacent Areas in Ashanti, Ghana",
        "citations": 5,
        "doi": "10.24018/EJGEO.2021.2.3.137",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["B. Theilen-Willige"],
        "venue": "Academic Conference",
        "tldr": "The Bosumtwi impact crater in Ashanti, Ghana is one of the most thoroughly investigated impact structures in Africa.",
        "abstract": ""
      },
      {
        "id": "Feasibility",
        "x": 0.2072,
        "y": -1.3168,
        "z": -1.6551,
        "title": "Feasibility of satellite image and GIS sampling for population representative surveys: a case study from rural Guatemala",
        "citations": 11,
        "doi": "10.1186/s12942-020-00250-0",
        "year": 2020,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["A. Miller", "P. Rohloff", "Alexandre Blake", "Eloin Dhaenens", "Leah Shaw", "E. Tuiz", "F. Grandesso", "Carlos Mendoza Montano", "Dana R. Thomson"],
        "venue": "International Journal of Health Geographics",
        "tldr": "Background Population-representative household survey methods require up-to-date sampling frames and sample designs that minimize time and cost of fieldwork especially in low- and middle-income countries.",
        "abstract": ""
      },
      {
        "id": "METHODOLOGY",
        "x": -0.1246,
        "y": -1.3447,
        "z": -1.5435,
        "title": "METHODOLOGY OF REMOTE SENSING DATA INTEGRATION INTO REGIONAL SOIL INFORMATION SYSTEMS FOR SOIL MORPHOGENETIC PROPERTIES ANALYSIS AND LAND USE OPTIMIZATION",
        "citations": 0,
        "doi": "10.25128/2519-4577.26.1.1",
        "year": 2026,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Taras Yamelynets", "Z. Pankiv", "Andriy Kyrylchuk", "Oleksiy Teleguz", "H. Ivanyuk"],
        "venue": "THE SCIENTIFIC ISSUES OF TERNOPIL VOLODYMYR HNATIUK NATIONAL PEDAGOGICAL UNIVERSITY. SERIES: GEOGRAPHY",
        "tldr": "The research addresses the fundamental scientific and practical problem of the qualitative discrepancy between outdated soil mapping materials and the contemporary needs of sustainable land management, precision agriculture, and environmental monitoring in Ukraine.",
        "abstract": ""
      },
      {
        "id": "pt_5_22",
        "x": -0.22,
        "y": -1.2831,
        "z": -1.4115,
        "title": "Індикативний ландшафтний моніторинг національних природних парків (на прикладі території НПП «Слобожанський»)",
        "citations": 4,
        "doi": "10.26565/2410-7360-2018-49-15",
        "year": 2018,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["\u0410. \u041e\u0432\u0447\u0430\u0440\u0435\u043d\u043a\u043e", "\u041e\u043a\u0441\u0430\u043d\u0430 \u0412\u0456\u043a\u0442\u043e\u0440\u0456\u0432\u043d\u0430 \u0417\u0430\u043b\u044e\u0431\u043e\u0432\u0441\u044c\u043a\u0430"],
        "venue": "Academic Conference",
        "tldr": "National Natural Parks (NNP) – protected areas where anthropogenic and natural landscapes are combined in the same territory.",
        "abstract": ""
      },
      {
        "id": "Monitoring",
        "x": 0.3334,
        "y": -1.2374,
        "z": -1.5102,
        "title": "Monitoring of erosion processes according to the data of satellite observations",
        "citations": 0,
        "doi": "10.33730/2077-4893.3.2015.317692",
        "year": 2015,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["S. Truskavetskiy", "K. Vyatkin", "A. Sherstiuk"],
        "venue": "Agroecological journal",
        "tldr": "The article considers approaches to erosion processes assessment on large areas with the use of satellite survey.",
        "abstract": ""
      },
      {
        "id": "Monitoring",
        "x": -0.1606,
        "y": -1.5052,
        "z": -1.5402,
        "title": "Monitoring of Damages to Cultural Heritage across Europe Using Remote Sensing and Earth Observation: Assessment of Scientific and Grey Literature",
        "citations": 27,
        "doi": "10.3390/rs15153748",
        "year": 2023,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["B. Cuca", "F. Zaina", "D. Tapete"],
        "venue": "Remote Sensing",
        "tldr": "This research is part of a wider framework of index literature studies that have been conducted in the past few years.",
        "abstract": ""
      },
      {
        "id": "pt_5_25",
        "x": -0.2201,
        "y": -1.3124,
        "z": -1.3881,
        "title": "ОСОБЕННОСТИ ПРОВЕДЕНИЯ КЛАССИФИКАЦИИ ЗЕМЕЛЬ СЕЛЬСКОХОЗЯЙСТВЕННОГО НАЗНАЧЕНИЯ НА ОСНОВЕ ДАННЫХ ДИСТАНЦИОННОГО ЗОНДИРОВАНИЯ ЗЕМЛИ",
        "citations": 0,
        "doi": "10.26178/ae.2025.12.48.001",
        "year": 2025,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["\u041c.\u0412. \u041a\u043e\u043b\u043e\u0434\u044f\u0436\u043d\u044b\u0439", "\u0412.\u0424. \u041f\u043e\u043f\u043e\u0432\u0438\u0447", "\u0415\u043b\u0435\u043d\u0430 \u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432\u043d\u0430 \u0414\u0443\u043d\u0430\u0435\u0432\u0430", "\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0421\u0442\u0435\u043f\u0430\u043d\u043e\u0432\u0438\u0447 \u041f\u0430\u0448\u0442\u0435\u0446\u043a\u0438\u0439"],
        "venue": "ПРОБЛЕМЫ АГРОХИМИИ И ЭКОЛОГИИ",
        "tldr": "Идентификация земель сельскохозяйственного назначения (ЗСН) является первоначальным шагом при анализе сельскохозяйственных полей.",
        "abstract": ""
      },
      {
        "id": "Latitudinal",
        "x": 0.2436,
        "y": -1.3959,
        "z": -1.3076,
        "title": "Latitudinal and Situational Zonation of Coastal Catenary Sequences Observed from Satellite Images Using the Biophysical Cross-shore Classification System (BCCS)",
        "citations": 11,
        "doi": "10.2112/JCOASTRES-D-19A-00011.1",
        "year": 2019,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["C. Finkl", "C. Makowski"],
        "venue": "Journal of Coastal Research",
        "tldr": "Latitudinal and situational zonation of coastal catenary sequences observed from satellite images using the Biophysical Cross-shore Classification System (BCCS).",
        "abstract": ""
      },
      {
        "id": "IMPLICATIONS",
        "x": 0.1354,
        "y": -1.2912,
        "z": -1.2921,
        "title": "IMPLICATIONS AND GEOTECHNOLOGICAL PROPOSITIONS FOR THE YANOMAMI INDIGENOUS PEOPLES DUE TO ILLEGAL EXPLORATION OF GOLD MININGS",
        "citations": 0,
        "doi": "10.56083/rcv4n10-105",
        "year": 2024,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["Andr\u00e9 Luis Siqueira", "Tanielle Santos Amorim", "Marcelo Augusto Machado Vasconcelos", "P. C. S. Bittencourt", "Artur Vin\u00edcius Ferreira dos Santos", "P. A. Melo", "Kellem Cristina Prestes Melo", "Romulo Luiz Oliveira da Silva"],
        "venue": "Revista contemporânea",
        "tldr": "The 1988 Federal Constitution recognizes the territorial and cultural rights of the Yanomami indigenous peoples, guaranteeing the demarcation of their lands and respect for their traditional ways of life.",
        "abstract": ""
      },
      {
        "id": "Potential",
        "x": 0.2157,
        "y": -1.2197,
        "z": -1.4657,
        "title": "Potential Dam Breach Analysis and Flood Wave Risk Assessment Using HEC-RAS and Remote Sensing Data: A Multicriteria Approach",
        "citations": 80,
        "doi": "10.3390/W13030364",
        "year": 2021,
        "clusterId": 5,
        "color": "#FF7F00",
        "size": 0.2,
        "authors": ["E. Psomiadis", "Lefteris T. Tomanis", "Antonis Kavvadias", "K. Soulis", "Nikos Charizopoulos", "S. Michas"],
        "venue": "Water",
        "tldr": "Dam breach has disastrous consequences for the economy and human lives.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "6",
    "clusterId": 6,
    "name": "Topic 5: Space Mission System Opera",
    "color": "#00C0BF",
    "pointCount": 25,
    "centroid": {
      "x": -1.3525,
      "y": 0.9496,
      "z": 1.2822
    },
    "points": [
      {
        "id": "Merging",
        "x": -1.1838,
        "y": 1.0213,
        "z": 1.2686,
        "title": "Merging and Dissipation of Intense Equatorial Plasma Bubbles With Large‐Scale Mid‐Latitude Low Electron Density Regions During the 23–24 April 2023 Geomagnetic Storm",
        "citations": 1,
        "doi": "10.1029/2025JA033744",
        "year": 2026,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Yuhao Zheng", "C. Xiong", "Xinyi Rang", "Shunzu Gao", "Xingxing Li"],
        "venue": "Journal of Geophysical Research - Space Physics",
        "tldr": "The extension of the post‐sunset equatorial plasma bubbles (EPBs) to mid‐latitudes during geomagnetic storms has been widely reported.",
        "abstract": ""
      },
      {
        "id": "The",
        "x": -1.2026,
        "y": 0.8733,
        "z": 1.1306,
        "title": "ID: astro-ph/0409568 | Year: 2004",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Resolving",
        "x": -1.5685,
        "y": 1.0455,
        "z": 1.1744,
        "title": "Resolving time-varying attitude jitter of an optical remote sensing satellite based on a time-frequency analysis.",
        "citations": 8,
        "doi": "10.1364/oe.392194",
        "year": 2020,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Z. Ye", "Yusheng Xu", "Shouzhu Zheng", "X. Tong", "Xiong Xu", "Sicong Liu", "Huan Xie", "Shijie Liu", "Chao Wei", "Uwe Stilla"],
        "venue": "Optics Express",
        "tldr": "This paper presents a novel processing framework for detecting, estimating, and investigating time-varying attitude jitter in long strips based on a time-frequency analysis with the input from either an attitude sensor or an optical imaging sensor.",
        "abstract": ""
      },
      {
        "id": "The",
        "x": -1.28,
        "y": 0.8787,
        "z": 1.3772,
        "title": "The Performance of the H.E.S.S.Target of Opportunity Alert System",
        "citations": 6,
        "doi": "10.1088/1742-6596/664/8/082002",
        "year": 2015,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["A. Balzer", "M. F\u00fcssling", "P. Hofverberg", "R. Parsons"],
        "venue": "Academic Conference",
        "tldr": "The High Energy Stereoscopic System (H.E.S.S.) is an array of five imaging atmospheric Cherenkov telescopes located in the Khomas Highland in Namibia.",
        "abstract": ""
      },
      {
        "id": "Wide-field",
        "x": -1.1759,
        "y": 0.8917,
        "z": 1.2394,
        "title": "Wide-field auroral imager onboard the Fengyun satellite",
        "citations": 49,
        "doi": "10.1038/s41377-019-0157-7",
        "year": 2019,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Xiaoxin Zhang", "Bo Chen", "Fei He", "K. Song", "Ling-Ping He", "Shijie Liu", "Quanfeng Guo", "Jiawei Li", "Xiao-Dong Wang", "Hong-Ji Zhang", "Hai-Feng Wang", "Zhengyue Han", "Liang Sun", "Pei-Jie Zhang", "S. Dai", "Guangxing Ding", "Li-Heng Chen", "Zhongsu Wang", "G. Shi", "Xin Zhang", "Chao Yu", "Zhongdong Yang", "P. Zhang", "Jin-song Wang"],
        "venue": "Light: Science & Applications",
        "tldr": "The newly launched Fengyun-3D (FY-3D) satellite carried a wide-field auroral imager (WAI) that was developed by Changchun Institute of Optics, Fine Mechanics and Physics, Chinese Academy of Sciences (CIOMP), which will provide a large field of view (FOV), high spatial resolution, and broadband ultraviolet images of the aurora and the ionosphere by imaging the N2 LBH bands of emissions.",
        "abstract": ""
      },
      {
        "id": "Gradient",
        "x": -1.2924,
        "y": 0.8829,
        "z": 1.3319,
        "title": "Gradient Path Labelling method and tracking method for calculation of solar differential rotation using coronal bright points",
        "citations": 5,
        "doi": "10.1016/J.ASCOM.2018.09.008",
        "year": 2018,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["I. Dorotovic", "A. Coelho", "J. Ryb\u00e1k", "A. Mora", "Rita Almeida Ribeiro"],
        "venue": "Astronomy and Computing",
        "tldr": "Abstract With new space missions, such as Solar Dynamics Observatory (SDO), solar images are being produced in unprecedented volumes.",
        "abstract": ""
      },
      {
        "id": "Performance",
        "x": -1.4955,
        "y": 0.762,
        "z": 1.4299,
        "title": "Performance Analysis of an Aerial Remote Sensing Platform Based on Real-Time Satellite Communication and Its Application in Natural Disaster Emergency Response",
        "citations": 8,
        "doi": "10.3390/rs16152866",
        "year": 2024,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Xiangli He", "Chong Xu", "Shengquan Tang", "Yuandong Huang", "Wenwen Qi", "Zikang Xiao"],
        "venue": "Remote Sensing",
        "tldr": "In this paper, we propose a design scheme for an aerial remote sensing platform based on real-time satellite communication.",
        "abstract": ""
      },
      {
        "id": "Centralized",
        "x": -1.2374,
        "y": 1.0653,
        "z": 1.0502,
        "title": "Centralized visual based navigation and control of a swarm of satellites for on-orbit servicing",
        "citations": 29,
        "doi": "10.1016/j.actaastro.2020.03.015",
        "year": 2020,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["M. Sabatini", "R. Volpe", "G. Palmerini"],
        "venue": "Acta Astronautica",
        "tldr": "Abstract In the framework of on-orbit proximity operations, small satellites represent an appealing solution in terms of costs, effectiveness and realization, but show intrinsic power, mass and computation limitations that could be overcome if cooperation among many spacecraft is considered.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -1.6138,
        "y": 0.9649,
        "z": 1.3174,
        "title": "A Doppler Effect Correction Method for APT Weather Satellite Image Reception",
        "citations": 5,
        "doi": "10.1109/ISPACS51563.2021.9651104",
        "year": 2021,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Shou-Sheu Lin", "Yan-Zhou Song"],
        "venue": "International Symposium on Intelligent Signal Processing and Communication Systems",
        "tldr": "In this paper, we propose a linear regression method to estimate the length of each line of the APT image, then, apply the interpolation to mitigate the Doppler shift and noise.",
        "abstract": ""
      },
      {
        "id": "Interpreting",
        "x": -1.0965,
        "y": 1.0688,
        "z": 1.2906,
        "title": "ID: astro-ph/0111466 | Year: 2001",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Multi-frame",
        "x": -1.5103,
        "y": 0.9229,
        "z": 1.3744,
        "title": "Multi-frame image restoration method for novel rotating synthetic aperture imaging system",
        "citations": 15,
        "doi": "10.1016/J.RINP.2021.103991",
        "year": 2021,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Xiyang Zhi", "Jiang Shikai", "Lei Zhang", "Hu Jianming", "Lijian Yu", "Xinhui Song", "J. Gong"],
        "venue": "Academic Conference",
        "tldr": "Abstract The novel rotating synthetic aperture (RSA) optical imaging system is an important development direction for future high-resolution optical remote sensing satellites in geostationary orbit.",
        "abstract": ""
      },
      {
        "id": "Towards",
        "x": -1.1776,
        "y": 0.9801,
        "z": 1.3082,
        "title": "ID: 2409.12327 | Year: 2024",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Intelligent",
        "x": -1.5388,
        "y": 0.9834,
        "z": 1.3405,
        "title": "Intelligent electro-optical systems for scalable space surveillance",
        "citations": 0,
        "doi": "10.1117/12.3094009",
        "year": 2026,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Y. Sechrest", "Joshua Maher", "L. Parker", "P. Wozniak", "Ava Moore", "Bram A. Schuijff", "J. M. Kirchner", "David M. Palmer"],
        "venue": "Defense + Security",
        "tldr": "We present progress in developing next generation real-time autonomous sensors for monitoring of the low Earth orbit (LEO) space object population.",
        "abstract": ""
      },
      {
        "id": "After",
        "x": -1.6235,
        "y": 0.8966,
        "z": 1.2991,
        "title": "After six months successful operations in low earth orbit: data processing system architecture and lessons learned from the LisR mission",
        "citations": 3,
        "doi": "10.23919/EDHPC59100.2023.10396501",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Sch\u00e4fer Konstantin", "Brunn Andreas", "Horch Clemens", "Bierdel Marius", "Jain Atin", "S. Frank"],
        "venue": "2023 European Data Handling & Data Processing Conference (EDHPC)",
        "tldr": "The LisR (Longwave Infrared Sensing demonstrator) mission was a successful technology demonstrator mission conducted on the Nanoracks Experimental Platform (NREP) outside the International Space Station (ISS).",
        "abstract": ""
      },
      {
        "id": "Radiation",
        "x": -1.5012,
        "y": 0.9934,
        "z": 1.3369,
        "title": "ID: 2112.08089 | Year: 2021",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Star",
        "x": -1.4166,
        "y": 0.9769,
        "z": 1.4003,
        "title": "Star Spots Extraction Method for Star Tracker in Dynamic Imaging Conditions",
        "citations": 0,
        "doi": "10.1109/ICAECCS68240.2025.11384770",
        "year": 2025,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Zoubida Mahi"],
        "venue": "2025 2nd International conference on Advances in Electronics, Control and Communication Systems (ICAECCS)",
        "tldr": "To this end, we developed a centroid extraction algorithm specifically adapted to star spots motion in the field of view.",
        "abstract": ""
      },
      {
        "id": "Precision",
        "x": -1.4595,
        "y": 1.0208,
        "z": 1.3386,
        "title": "Precision – A very-high resolution imager – Design through to manufacture",
        "citations": 0,
        "doi": "10.1117/12.2691125",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Kyriaki Minoglou", "Nikos Karafolas", "B. Cugny", "Knox S.a"],
        "venue": "International Conference on Space Optics",
        "tldr": "Precision is a very high resolution earth observation imager that delivers high quality and high area coverage for pan-sharpened imagery and has been developed by SSTL as part of a ESAs Incubed programme.",
        "abstract": ""
      },
      {
        "id": "Target-Driven",
        "x": -1.0577,
        "y": 0.8029,
        "z": 1.1978,
        "title": "Target-Driven Real-Time Geometric Processing Based on VLR Model for LuoJia3-02 Satellite",
        "citations": 3,
        "doi": "10.1109/LGRS.2024.3452793",
        "year": 2024,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Rongfan Dai", "Mi Wang", "Ru Chen", "Zhiqi Zhang"],
        "venue": "IEEE Geoscience and Remote Sensing Letters",
        "tldr": "The on-board processing systems of high-resolution optical satellites performing hotspot observations must be of high efficiency and high precision.",
        "abstract": ""
      },
      {
        "id": "Improved",
        "x": -1.2212,
        "y": 0.9825,
        "z": 1.2144,
        "title": "Improved Methodology for GOES-R ABI Data Resampling for Hot Spot Detection and Fire Monitoring",
        "citations": 0,
        "doi": "10.1109/TGRS.2025.3585061",
        "year": 2025,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Monica J. Cook", "F. Padula", "E. Bacon", "D. Pogorzala", "A. Pearlman", "Michael Pavolonis", "Daniel T. Lindsey"],
        "venue": "IEEE Transactions on Geoscience and Remote Sensing",
        "tldr": "The advanced baseline imager (ABI) on the Geostationary Operational Environmental Satellite (GOES)-R series includes both visible and infrared spectral bands that are used to locate and retrieve subpixel characteristics of fires.",
        "abstract": ""
      },
      {
        "id": "High-Resolution",
        "x": -1.2127,
        "y": 0.8502,
        "z": 1.3571,
        "title": "High-Resolution Imaging Capability of Large-Scale LEO Satellite Constellations",
        "citations": 0,
        "doi": "10.1109/ICC51166.2024.10622727",
        "year": 2024,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["Lhamo Dorje", "Xiaohua Li", "Yu Chen", "Nihal Poredi"],
        "venue": "ICC 2024 - IEEE International Conference on Communications",
        "tldr": "There has been a great interest in deploying large-scale Low-Earth Orbit (LEO) satellite constellations for wireless communications.",
        "abstract": ""
      },
      {
        "id": "Algorithms",
        "x": -1.4782,
        "y": 0.9498,
        "z": 1.3521,
        "title": "Algorithms for increasing the resource of ROM and RRD memory operation in deep space conditions",
        "citations": 0,
        "doi": "10.37791/2687-0649-2025-20-4-82-91",
        "year": 2025,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["M. Andrianov", "Konstantin Belousov", "R. A. Cherny"],
        "venue": "Journal Of Applied Informatics",
        "tldr": "In space-ground interferometry systems, in order to improve UV plane filling and the quality of synthesized images, antenna systems separated from each other are used, thus forming variable projections of the spacecraft – ground receiving station.",
        "abstract": ""
      },
      {
        "id": "2017",
        "x": -1.1935,
        "y": 0.9729,
        "z": 1.3537,
        "title": "2017 International Conference on Space Science and Communication",
        "citations": 0,
        "doi": "10.1088/1742-6596/852/1/011001",
        "year": 2017,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["W. Suparta", "M. Ismail", "Mardina Abdullah", "M. Faruque", "K. N. Maulud", "M. Nadzir", "M. Singh", "Jit Singh", "Z. Abidin"],
        "venue": "Academic Conference",
        "tldr": "Table of Content Preface 2017 International Conference on Space Science and Communication “Space Science for Sustainability” The present volume of the Journal of Physics: Conference Series represents contributions from participants of the 2017 International Conference on Space Science and Communication (IconSpace2017) held in Kuala Lumpur, Malaysia from May 3-5, 2017.",
        "abstract": ""
      },
      {
        "id": "Infrared",
        "x": -1.5059,
        "y": 0.984,
        "z": 1.2695,
        "title": "ID: 2210.04770 | Year: 2022",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "High-Accuracy",
        "x": -1.1521,
        "y": 1.0249,
        "z": 1.0904,
        "title": "High-Accuracy Star Tracker ASTRO XP",
        "citations": 0,
        "doi": "10.5270/esa-gnc-icatt-2023-056",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": ["U. Schmidt", "R. W\u00fcrl", "M. Griebel", "J\u00f6rg Reichardt", "Daniel Adolf", "Thomas K\u00fchn", "Steffen Kirschstein", "I. Steinbach"],
        "venue": "Papers of ESA GNC-ICATT 2023",
        "tldr": "Jena-Optronik GmbH, located in Jena/Germany, has profound experience in designing and  manufacturing star trackers since the early 80ties.",
        "abstract": ""
      },
      {
        "id": "Detailed",
        "x": -1.6169,
        "y": 0.9445,
        "z": 1.211,
        "title": "ID: 2106.01611 | Year: 2021",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 6,
        "color": "#00C0BF",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      }
    ]
  },
  {
    "id": "7",
    "clusterId": 7,
    "name": "Topic 6: Satellite Road Image Proce",
    "color": "#A65628",
    "pointCount": 22,
    "centroid": {
      "x": 0.5192,
      "y": 1.3588,
      "z": 0.9629
    },
    "points": [
      {
        "id": "Correcting",
        "x": 0.7406,
        "y": 1.4848,
        "z": 1.0502,
        "title": "ID: 2211.06544 | Year: 2022",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Design",
        "x": 0.7144,
        "y": 1.2646,
        "z": 0.9448,
        "title": "Design and development of remote sensing image data production system for provincial satellite center",
        "citations": 0,
        "doi": "10.1117/12.2668150",
        "year": 2023,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["W. Feng", "Sanwu Xie", "Zengzeng Cao", "Gang Xu", "Hao Chen", "Lin\u2019ge Su", "Jiaqi Zhang"],
        "venue": "Fourth International Conference on Geoscience and Remote Sensing Mapping",
        "tldr": "With the development of remote sensing satellite technology, the richness and data level of satellite images are rising rapidly.",
        "abstract": ""
      },
      {
        "id": "Runway",
        "x": 0.5429,
        "y": 1.3472,
        "z": 0.6528,
        "title": "Runway detection in High Resolution remote sensing data",
        "citations": 19,
        "doi": "10.1109/ISPA.2015.7306053",
        "year": 2015,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Philip T. G. Jackson", "C. Nelson", "J. Schiefele", "B. Obara"],
        "venue": "International Symposium on Image and Signal Processing and Analysis",
        "tldr": "In this paper we establish a novel method for accurate and precise extraction of geometric polygons for an arbitrary number of runways in VHR remote sensing imagery.",
        "abstract": ""
      },
      {
        "id": "Hardware-Optimized",
        "x": 0.2352,
        "y": 1.366,
        "z": 0.9505,
        "title": "Hardware-Optimized Architecture of On-Board Registration for Remote-Sensing Images —Take SURF as an Example",
        "citations": 6,
        "doi": "10.1109/JSTARS.2024.3377663",
        "year": 2024,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Xin Du", "Cankun Yang", "Ruofei Zhong", "Qingyang Li", "Yuanhang Wang", "Zhaoming Huang", "Xianlin Liu"],
        "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
        "tldr": "On-board processing has become an inevitable choice for the development of remote-sensing satellites.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": 0.6351,
        "y": 1.3542,
        "z": 0.7093,
        "title": "An Automatic Approach of Road Regions Extraction from Satellite Images based on Connected Component Algorithm",
        "citations": 0,
        "doi": "10.21275/v5i6.21061603",
        "year": 2016,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["M. Shrivastava", "D. Bhalerao"],
        "venue": "Academic Conference",
        "tldr": ": Satellite images provide valuable information for a wide range of applications.",
        "abstract": ""
      },
      {
        "id": "Novel",
        "x": 0.4072,
        "y": 1.198,
        "z": 0.8021,
        "title": "Novel pseudo random key & cosine transformed chaotic maps based satellite image encryption",
        "citations": 35,
        "doi": "10.1007/s11042-021-10970-5",
        "year": 2021,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Atul Kumar", "M. Dua"],
        "venue": "Multimedia tools and applications",
        "tldr": "Image encryption converts the images into unrecognizable forms that seems like a white noise.",
        "abstract": ""
      },
      {
        "id": "pt_7_6",
        "x": 0.259,
        "y": 1.3701,
        "z": 0.91,
        "title": "“Hangtian Tsinghua-1” Micro-Satellite and Its Image Processing",
        "citations": 1,
        "doi": "10.11834/jrs.20010304",
        "year": 2001,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Dai Mi"],
        "venue": "National Remote Sensing Bulletin",
        "tldr": "In this paper, we introduce the research background and key technical parameters of “Hangtian Tsinghua_1” micro_satellite.",
        "abstract": ""
      },
      {
        "id": "Method",
        "x": 0.721,
        "y": 1.5015,
        "z": 1.0644,
        "title": "Method for constructing a network of urban roads using satellite images",
        "citations": 0,
        "doi": "10.1088/1757-899X/1047/1/012037",
        "year": 2021,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["E. M. Vikhtenko", "A. A. Tusikova"],
        "venue": "Academic Conference",
        "tldr": "An automatic method for recognizing the urban network of highways on high-resolution satellite images has been developed and implemented, based on the use of the Mask-RCNN convolutional neural network.",
        "abstract": ""
      },
      {
        "id": "Optimizing",
        "x": 0.3873,
        "y": 1.3712,
        "z": 1.0772,
        "title": "Optimizing Geospatial Data for ML/CV Applications: A Python-Based Approach to Streamlining Map Processing by Removing Irrelevant Areas",
        "citations": 2,
        "doi": "10.3390/app142411978",
        "year": 2024,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["David Kasperek", "Micha\u0142 Podpora"],
        "venue": "Applied Sciences",
        "tldr": "The method presented in this paper involves three basic steps: road segmentation (using the Shapely module) to facilitate handling high-resolution orthoimagery, and then a modified Region-of-Interest approach, i.e., removing irrelevant areas, with only roads remaining.",
        "abstract": ""
      },
      {
        "id": "Very",
        "x": 0.735,
        "y": 1.4619,
        "z": 1.1083,
        "title": "Very High Resolution Satellite Image Classification Using Fuzzy Rule-Based Systems",
        "citations": 70,
        "doi": "10.3390/a6040762",
        "year": 2013,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["S. Jabari", "Yun Zhang"],
        "venue": "Algorithms",
        "tldr": "The aim of this research is to present a detailed step-by-step method for classification of very high resolution urban satellite images (VHRSI) into specific classes such as road, building, vegetation, etc., using fuzzy logic.",
        "abstract": ""
      },
      {
        "id": "Comparative",
        "x": 0.2961,
        "y": 1.2834,
        "z": 0.9098,
        "title": "Comparative Analysis of BRISK and ORB Methods for Local Feature Detection in Satellite Imagery",
        "citations": 3,
        "doi": "10.18372/1990-5548.83.19879",
        "year": 2025,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Artem Riabko", "Vitalii Hrishnenko"],
        "venue": "Electronics and Control Systems",
        "tldr": "Binary local feature detection, which is very important for the satellite image processing of object recognition and image matching, was studied in this paper.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.6593,
        "y": 1.4874,
        "z": 0.86,
        "title": "A Preprocessing Method for Moving Vehicle Images Based on Satellite Images",
        "citations": 0,
        "doi": "10.1109/ICCECE65250.2025.10985452",
        "year": 2025,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["wenxin cai", "Jing Wang", "Haijun He", "Guanghao Liu", "Xiaosong Li", "Dudu Guo"],
        "venue": "2025 5th International Conference on Consumer Electronics and Computer Engineering (ICCECE)",
        "tldr": "In this paper, an image preprocessing and image enhancement method is proposed to improve the visibility of vehicle targets, reduce background interference, and provide support for subsequent vehicle detection and tracking tasks.",
        "abstract": ""
      },
      {
        "id": "Analysis",
        "x": 0.575,
        "y": 1.4734,
        "z": 0.8646,
        "title": "Analysis of JPEG2000 Compression Quality of Optical Satellite Images",
        "citations": 6,
        "doi": "10.1109/acctcs53867.2022.00107",
        "year": 2022,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Xia-Qiong Yu", "Jinxian Zhao", "Tao Zhu", "Q. Lan", "Lin Gao", "Lingzhi Fan"],
        "venue": "2022 2nd Asia-Pacific Conference on Communications Technology and Computer Science (ACCTCS)",
        "tldr": "Remote sensing satellite image compression processing technology is an important means to realize high-quality image and fast data transmission at the same time.",
        "abstract": ""
      },
      {
        "id": "Design",
        "x": 0.4971,
        "y": 1.3716,
        "z": 1.0463,
        "title": "Design and Development of Decorrelation Stretch Technique for Enhancing the Quality of Satellite Images with Improved MSE and UIQI in Comparison with Wiener Filter",
        "citations": 7,
        "doi": "10.1149/10701.13279ecst",
        "year": 2022,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["N. R", "S. Priya"],
        "venue": "ECS Transactions",
        "tldr": "Image enhancement is the process of increasing the quality of an image by enhancing certain features of an image and the resultant image is more suitable than the input image.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": 0.5834,
        "y": 1.4931,
        "z": 1.0784,
        "title": "An Enhanced Type II Fuzzy Set Algorithm for Satellite Images Contrast Improvement",
        "citations": 0,
        "doi": "10.32520/stmsi.v15i6.6474",
        "year": 2026,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["M. Al-Abaji", "Mohammed Hazim Alkawaz"],
        "venue": "SISTEMASI",
        "tldr": "Satellite images contain detailed information that is of great importance in the field of remote sensing.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.3913,
        "y": 1.0642,
        "z": 1.0742,
        "title": "A Histogram Equalization Algorithm about Second Generation Wavelet Integer Transform",
        "citations": 0,
        "doi": "10.2991/ICMMCT-16.2016.59",
        "year": 2016,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Jianye Peng", "Yi Zhang"],
        "venue": "Academic Conference",
        "tldr": "In view of the traditional processing defects of histogram image, this paper proposes a new histogram equalization algorithm about second generation wavelet integer transform.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 0.5735,
        "y": 1.445,
        "z": 1.0168,
        "title": "A New Structural Matching Method Based on Linear Features for High Resolution Satellite Images",
        "citations": 0,
        "doi": "10.29252/JGIT.6.4.1",
        "year": 2019,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Somayeh Yavari", "M. J. V. Zoej", "M. Sahebi", "M. Mokhtarzade"],
        "venue": "Journal of Geospatial Information Technology",
        "tldr": "So, in this paper, the automatic matching procedure is performed and assessed using a new structural linear feature-based matching method with no need to any initial information.",
        "abstract": ""
      },
      {
        "id": "Multichannel",
        "x": 0.5949,
        "y": 1.456,
        "z": 1.0063,
        "title": "Multichannel and Multispectral Image Restoration Employing Fuzzy Theory and Directional Techniques",
        "citations": 0,
        "doi": "10.5772/7062",
        "year": 2009,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["A. Rosales", "V. Ponomaryov"],
        "venue": "Academic Conference",
        "tldr": "Satellite, Radar, Medical, High Definition Television, Virtual Reality, Electron Microscopy, etc.",
        "abstract": ""
      },
      {
        "id": "Destriping",
        "x": 0.5222,
        "y": 1.4239,
        "z": 1.0906,
        "title": "Destriping methods for high resolution satellite multispectral remote sensing image based on GPU adaptive partitioning technology",
        "citations": 1,
        "doi": "10.1117/12.2325311",
        "year": 2018,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Xue Yang", "Feng Li", "Lei Xin", "Cheng Wang", "Xiaoyong Wang", "Xing Chang"],
        "venue": "Remote Sensing",
        "tldr": "The stripe noise is a key factor that affects imaging quality of satellite multi-hyperspectral remote sensing images, which also has a serious effect on the interpretation and information extraction of remote sensing images.",
        "abstract": ""
      },
      {
        "id": "Digital",
        "x": 0.6372,
        "y": 1.119,
        "z": 0.8097,
        "title": "Digital Image and Video Processing: Algorithms and Applications",
        "citations": 3,
        "doi": "10.52783/jes.1516",
        "year": 2024,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["K. S. Patil", "Satwinder Singh", "Aditya R Unnithan", "A. Maury"],
        "venue": "Journal of Electrical Systems",
        "tldr": "Many of the techniques that are used in digital image and video processing were developed in the 1960s at Bell Laboratories.",
        "abstract": ""
      },
      {
        "id": "Slope-Restricted",
        "x": 0.2332,
        "y": 1.2828,
        "z": 1.0098,
        "title": "Slope-Restricted Multi-Scale Feature Matching for Geostationary Satellite Remote Sensing Images",
        "citations": 10,
        "doi": "10.3390/rs9060576",
        "year": 2017,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["Dan Zeng", "Lidan Wu", "Boyang Chen", "Wei Shen"],
        "venue": "Remote Sensing",
        "tldr": "For geostationary meteorological satellite (GSMS) remote sensing image registration, high computational cost and matching error are the two main challenging problems.",
        "abstract": ""
      },
      {
        "id": "ALGORITHM",
        "x": 0.4823,
        "y": 1.2734,
        "z": 1.1471,
        "title": "ALGORITHM FOR CLOUD COVER DETECTION ON MOSAIC SATELLITE IMAGES WITH BRIGHTNESS EQUALIZATION",
        "citations": 0,
        "doi": "10.21667/978-5-7722-0428-3-110-114",
        "year": 2025,
        "clusterId": 7,
        "color": "#A65628",
        "size": 0.2,
        "authors": ["A. Soloviev", "V. Arkhipkin"],
        "venue": "Modern Technologies in Science and Education. MTSE-2025",
        "tldr": "This paper presents an algorithm for detecting clouds in satellite images.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "8",
    "clusterId": 8,
    "name": "Topic 7: Ocean Cloud SDS Modeling",
    "color": "#F781BF",
    "pointCount": 18,
    "centroid": {
      "x": 1.1319,
      "y": -0.1957,
      "z": -0.5473
    },
    "points": [
      {
        "id": "Hyperfield",
        "x": 1.0953,
        "y": -0.1745,
        "z": -0.3765,
        "title": "Hyperfield - Hyperspectral small satellites for improving life on Earth",
        "citations": 5,
        "doi": "10.1109/AERO55745.2023.10115806",
        "year": 2023,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["T. Tikka", "J. Makynen", "M. Shimoni"],
        "venue": "IEEE Aerospace Conference",
        "tldr": "This paper presents the first and second generations of the Hyperfield satellites.",
        "abstract": ""
      },
      {
        "id": "Geophysical",
        "x": 1.0759,
        "y": -0.3687,
        "z": -0.6327,
        "title": "Geophysical validation and long-term consistency between GOME-2/MetOp-A total ozone column and measurements from the sensors GOME/ERS-2, SCIAMACHY/ENVISAT and OMI/Aura",
        "citations": 40,
        "doi": "10.5194/AMT-5-2169-2012",
        "year": 2012,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["M. Koukouli", "D. Balis", "D. Loyola", "P. Valks", "W. Zimmer", "N. Hao", "J. Lambert", "M. Roozendael", "C. Lerot", "R. Spurr"],
        "venue": "Academic Conference",
        "tldr": "The main aim of the paper is to assess the consistency of five years of Global Ozone Monitoring Experiment-2/Metop-A [GOME-2] total ozone columns and the long-term total ozone satellite monitoring database already in existence through an extensive inter-comparison and validation exercise using as reference Brewer and Dobson ground-based measurements.",
        "abstract": ""
      },
      {
        "id": "Reconstructing",
        "x": 1.3957,
        "y": -0.2886,
        "z": -0.5735,
        "title": "Reconstructing Gap-Free Daily Remote Sensing Reflectance in the Marginal Seas Using the DINEOF Method",
        "citations": 2,
        "doi": "10.1109/JSTARS.2025.3563216",
        "year": 2025,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Shuyan Lang", "Yuxuan Jiang", "Shengqiang Wang", "Yongjun Jia", "Yi Zhang"],
        "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
        "tldr": "Ocean color remote sensing has provided extensive datasets of various bio-optical parameters, which are essential for studying marine biogeochemical processes and ecosystems.",
        "abstract": ""
      },
      {
        "id": "Impact",
        "x": 1.0957,
        "y": -0.213,
        "z": -0.4035,
        "title": "Impact of water vapor transfer on a Circum-Bohai-Sea heavy fog: Observation and numerical simulation",
        "citations": 25,
        "doi": "10.1016/J.ATMOSRES.2019.06.008",
        "year": 2019,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Meng Tian", "Bingui Wu", "H\u00e9l\u00e8ne Huang", "Hongsheng Zhang", "Wenyu Zhang", "Zhaoyu Wang"],
        "venue": "Atmospheric research",
        "tldr": "Abstract a wide-range winter frontal fog that happened over Circum-Bohai-Sea (CBS) on December 17–192,016 was observed using satellite cloud image inversion, surface, ocean buoy, and radiosonde data.",
        "abstract": ""
      },
      {
        "id": "Radiometric",
        "x": 1.178,
        "y": -0.4244,
        "z": -0.6654,
        "title": "Radiometric Evaluation of SNPP VIIRS Band M11 via Sub-Kilometer Intercomparison with Aqua MODIS Band 7 over Snowy Scenes",
        "citations": 4,
        "doi": "10.3390/rs10030413",
        "year": 2018,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Mike Chu", "Junqiang Sun", "Menghua Wang"],
        "venue": "Remote Sensing",
        "tldr": "A refined intersensor comparison study is carried out to evaluate the radiometric stability of the 2257 nm channel (M11) of the first Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the Suomi National Polar-orbiting Partnership (SNPP) satellite.",
        "abstract": ""
      },
      {
        "id": "Enhanced",
        "x": 0.9985,
        "y": -0.3002,
        "z": -0.5522,
        "title": "Enhanced MOPITT data coverage through cloud detection improvement",
        "citations": 0,
        "doi": "10.5194/AMT-2021-112",
        "year": 2021,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["H. Marey", "J. Drummond", "Dylan B. A. Jones", "H. Worden", "M. Deeter", "J. Gille", "D. Mao"],
        "venue": "Academic Conference",
        "tldr": "The Measurements of Pollution in the Troposphere (MOPITT) satellite instrument has been measuring global tropospheric carbon monoxide (CO) since March 2000, providing the longest nearly continuous record of CO from space.",
        "abstract": ""
      },
      {
        "id": "SST",
        "x": 1.2032,
        "y": 0.0336,
        "z": -0.4467,
        "title": "SST Comparison of AVHRR and MODIS Time Series in the Western Mediterranean Sea",
        "citations": 12,
        "doi": "10.3390/rs12142241",
        "year": 2020,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Mar\u00eda Jos\u00e9 L\u00f3pez Garc\u00eda"],
        "venue": "Remote Sensing",
        "tldr": "This paper presents a comparison of the monthly SST data derived from both sensors, AVHRR and MODIS, in a series of ten years (2000–2009) in the Western Mediterranean basins.",
        "abstract": ""
      },
      {
        "id": "Microphysical",
        "x": 1.2525,
        "y": -0.0188,
        "z": -0.4807,
        "title": "Microphysical, macrophysical, and radiative responses of subtropical marine clouds to aerosol injections",
        "citations": 37,
        "doi": "10.5194/acp-23-1345-2023",
        "year": 2023,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Je-Yun Chun", "R. Wood", "P. Blossey", "S. Doherty"],
        "venue": "Atmospheric Chemistry and Physics",
        "tldr": "Ship tracks in subtropical marine low clouds are simulated and investigated using large-eddy simulations.",
        "abstract": ""
      },
      {
        "id": "Assessing",
        "x": 1.0981,
        "y": -0.045,
        "z": -0.5705,
        "title": "Assessing Zooplankton Communities' Influence on Particulate Organic Carbon Concentration",
        "citations": 0,
        "doi": "10.1029/2026GL122225",
        "year": 2026,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Thelma Pana\u00efotis", "B. Cael"],
        "venue": "Geophysical Research Letters",
        "tldr": "Zooplankton play a key role in setting the particulate organic carbon (POC) distribution in the ocean, but this role remains poorly quantified on large scales due to the complexity of zooplankton ecosystems and the sparsity and variability of observations.",
        "abstract": ""
      },
      {
        "id": "On-orbit",
        "x": 1.1766,
        "y": -0.225,
        "z": -0.6456,
        "title": "On-orbit NOAA-20 VIIRS solar diffuser bidirectional reflectance distribution function and screen transmittance characterization using yaw manoeuvres and regular on-orbit SDSM data",
        "citations": 9,
        "doi": "10.1080/01431161.2020.1739353",
        "year": 2020,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["T. Choi", "X. Shao", "S. B\u0142o\u0144ski", "C. Cao"],
        "venue": "International Journal of Remote Sensing",
        "tldr": "ABSTRACT On-orbit radiometric calibration of the Visible Infrared Imaging Radiometer Suite (VIIRS) sensor onboard the National Oceanic and Atmospheric Administration’s (NOAA) NOAA-20 satellite is dependent on Solar Diffuser (SD) and Solar Diffuser Stability Monitor (SDSM) observations for the Reflective Solar Bands (RSBs).",
        "abstract": ""
      },
      {
        "id": "Improving",
        "x": 0.9685,
        "y": -0.3498,
        "z": -0.4367,
        "title": "Improving Chlorophyll-A Estimation From Sentinel-2 (MSI) in the Barents Sea Using Machine Learning",
        "citations": 16,
        "doi": "10.1109/JSTARS.2021.3074975",
        "year": 2021,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["M. Asim", "C. Brekke", "Arif Mahmood", "T. Eltoft", "M. Reigstad"],
        "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
        "tldr": "To accurately estimate Chl-a, we propose to use additional information on pigment content within the productive column by matching the depth-integrated Chl-a concentrations with the satellite data.",
        "abstract": ""
      },
      {
        "id": "Atmospheric",
        "x": 0.9997,
        "y": -0.0276,
        "z": -0.4414,
        "title": "Atmospheric correction of HJ1-A/B images and the effects on remote sensing monitoring of cyanobacteria bloom",
        "citations": 1,
        "doi": "10.5194/PIAHS-368-69-2015",
        "year": 2015,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Hongxu Ma", "Shenglian Guo", "Xingjun Hong", "Yanlai Zhou"],
        "venue": "Academic Conference",
        "tldr": "The HJ-1A/B satellite offers free images with high spatial and temporal resolution, which are effective for dynamically monitoring cyanobacteria blooms.",
        "abstract": ""
      },
      {
        "id": "Optical",
        "x": 0.7945,
        "y": -0.1719,
        "z": -0.5813,
        "title": "Optical system of high-precision greenhouse gas imaging spectrometer",
        "citations": 3,
        "doi": "10.1117/12.2324304",
        "year": 2018,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Q. Pan", "Wei-min Shen"],
        "venue": "Asia-Pacific Remote Sensing",
        "tldr": "The increase of atmospheric concentration of anthropogenic greenhouse gases(GHGs), primarily carbon dioxide(CO2) and methane(CH4), is concerned as a main cause of the global climate change.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 1.0149,
        "y": -0.3923,
        "z": -0.3292,
        "title": "A Remote-Sensing Method to Estimate Bulk Refractive Index of Suspended Particles from GOCI Satellite Measurements over Bohai Sea and Yellow Sea",
        "citations": 2,
        "doi": "10.3390/app10010023",
        "year": 2019,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["Deyong Sun", "Zunbin Ling", "Shengqiang Wang", "Z. Qiu", "Yu Huan", "Z. Mao", "Yijun He"],
        "venue": "Applied Sciences",
        "tldr": "The bulk refractive index (np) of suspended particles, an apparent measure of particulate refraction capability and yet an essential element of particulate compositions and optical properties, is a critical indicator that helps understand many biogeochemical processes and ecosystems in marine waters.",
        "abstract": ""
      },
      {
        "id": "MOD2SEA",
        "x": 1.3593,
        "y": -0.1942,
        "z": -0.7069,
        "title": "MOD2SEA: A Coupled Atmosphere-Hydro-Optical Model for the Retrieval of Chlorophyll-a from Remote Sensing Observations in Complex Turbid Waters",
        "citations": 28,
        "doi": "10.3390/RS8090722",
        "year": 2016,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["B. Arabi", "M. S. Salama", "M. Wernand", "W. Verhoef"],
        "venue": "Remote Sensing",
        "tldr": "An accurate estimation of the chlorophyll-a (Chla) concentration is crucial for water quality monitoring and is highly desired by various government agencies and environmental groups.",
        "abstract": ""
      },
      {
        "id": "Biophysical",
        "x": 1.1898,
        "y": 0.0291,
        "z": -0.4969,
        "title": "Biophysical Submesoscale Processes in the Wake of Hurricane Ivan: Simulations and Satellite Observations",
        "citations": 6,
        "doi": "10.3390/jmse7110378",
        "year": 2019,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["T. Smith", "J. Jolliff", "N. Walker", "S. Anderson"],
        "venue": "Journal of Marine Science and Engineering",
        "tldr": "Tropical cyclone induced phytoplankton productivity is examined using a tropical cyclone version of the Coupled Ocean/Atmosphere Mesoscale Prediction System (COAMPS®).",
        "abstract": ""
      },
      {
        "id": "Excess",
        "x": 1.1216,
        "y": -0.1156,
        "z": -0.837,
        "title": "Excess 210Po and nutrient recycling within the California coastal transition zone",
        "citations": 35,
        "doi": "10.1029/92JC01932",
        "year": 1993,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["D. Kadko"],
        "venue": "Oceanographic Literature Review",
        "tldr": "Profiles of [sup 210]Pb, [sup 210]Po, and nutrients were measured within a cold, chlorophyll-rich filament observed in satellite images off Point Arena, California.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": 1.356,
        "y": -0.2758,
        "z": -0.6751,
        "title": "A new space technology for ocean observation: the SMOS mission",
        "citations": 15,
        "doi": "10.3989/SCIMAR.03621.19K",
        "year": 2012,
        "clusterId": 8,
        "color": "#F781BF",
        "size": 0.2,
        "authors": ["J. Font", "J. Ballabrera\u2010Poy", "Adriano Camps", "I. Corbella", "N. Duffo", "I. Dur\u00e1n", "M. Emelianov", "L. Enrique", "P. Fern\u00e1ndez", "C. Gabarr\u00f3", "C. M. Gonz\u00e1lez", "V. Gonz\u00e1lez", "J. Gourrion", "S. Guimbard", "N. Hoareau", "A. Julia", "S. Kalaroni", "A. Konstantinidou", "A. Aretxabaleta", "Justino Mart\u00ednez", "J. Miranda", "A. Monerris", "Sergio Montero", "B. Mourre", "M. Pablos", "F. P\u00e9rez", "M. Piles", "M. Portabella", "R. Sabia", "J. Salvador", "M. Talone", "F. Torres", "A. Turiel", "M. Vall-llossera", "R. Villarino"],
        "venue": "Academic Conference",
        "tldr": "This paper introduces SMOS in the ocean remote sensing context, and summarizes the MIRAS principles of operation and the SMOS salinity retrieval approach.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "9",
    "clusterId": 9,
    "name": "Topic 8: Hyperspectral Crop Feature",
    "color": "#E6AB02",
    "pointCount": 10,
    "centroid": {
      "x": -0.5644,
      "y": 0.6211,
      "z": -0.4021
    },
    "points": [
      {
        "id": "HyperDB",
        "x": -0.5006,
        "y": 0.6218,
        "z": -0.5823,
        "title": "HyperDB: A Hyperspectral Land Class Database Designed for an Image Processing System",
        "citations": 6,
        "doi": "10.1109/TST.2017.7830901",
        "year": 2017,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["Yizhou Fan"],
        "venue": "Academic Conference",
        "tldr": "In this paper, we present a hyperspectral database (HyperDB) designed to cooperate with an embedded hyperspectral image processing system developed by the authors.",
        "abstract": ""
      },
      {
        "id": "CalCROP21",
        "x": -0.7409,
        "y": 0.491,
        "z": -0.4826,
        "title": "ID: 2107.12499 | Year: 2021",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Crop",
        "x": -0.3897,
        "y": 0.8153,
        "z": -0.5036,
        "title": "Crop Classification Combining Object-Oriented Method and Random Forest Model Using Unmanned Aerial Vehicle (UAV) Multispectral Image",
        "citations": 26,
        "doi": "10.3390/agriculture14040548",
        "year": 2024,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["Hui Deng", "Wenjiang Zhang", "Xiaoqian Zheng", "Houxi Zhang"],
        "venue": "Agriculture",
        "tldr": "The accurate and timely identification of crops holds paramount significance for effective crop management and yield estimation.",
        "abstract": ""
      },
      {
        "id": "Deep",
        "x": -0.8045,
        "y": 0.7081,
        "z": -0.4187,
        "title": "Deep NMF and Autoencoder: A Comparative Analysis for Hyperspectral Unmixing Using Prisma Real Images",
        "citations": 4,
        "doi": "10.1109/IGARSS53475.2024.10642930",
        "year": 2024,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["Gaetano Settembre", "N. Buono", "Flavia Esposito", "Nicol\u00f2 Taggio"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "In this study, among models capable of performing linear spectral unmixing, we present a comparative analysis performed on real data acquired from the PRISMA (PRecursore IperSpettrale della Missione Applicativa) hyperspectral satellite between deep nonnegative matrix factorization and artificial neural network autoencoder based methods.",
        "abstract": ""
      },
      {
        "id": "On",
        "x": -0.2919,
        "y": 0.715,
        "z": -0.4441,
        "title": "On Parallelizing Geometrical PCA Approximation",
        "citations": 3,
        "doi": "10.1109/ROEDUNET.2019.8909644",
        "year": 2019,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["A. Machidon", "C. Ciobanu", "O. Machidon", "P. Ogrutan"],
        "venue": "International Conference on Networking in Education and Research",
        "tldr": "Remote sensing data has known an explosive growth in the past decade.",
        "abstract": ""
      },
      {
        "id": "From",
        "x": -0.4177,
        "y": 0.8175,
        "z": -0.3424,
        "title": "From Do-It-Yourself Design to Discovery: A Comprehensive Approach to Hyperspectral Imaging from Drones",
        "citations": 4,
        "doi": "10.3390/rs16173202",
        "year": 2024,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["Oliver K. Hasler", "H. L\u00f8v\u00e5s", "A. Oudijk", "T. Bryne", "T. Johansen"],
        "venue": "Remote Sensing",
        "tldr": "This paper presents an innovative, holistic, and comprehensive approach to drone-based imaging spectroscopy based on a small, cost-effective, and lightweight Unmanned Aerial Vehicle (UAV) payload intended for remote sensing applications.",
        "abstract": ""
      },
      {
        "id": "Remote",
        "x": -0.6651,
        "y": 0.4747,
        "z": -0.2199,
        "title": "Remote Sensing Using Unmanned Aerial Vehicles for Water Stress Detection: A Review Focusing on Specialty Crops",
        "citations": 48,
        "doi": "10.3390/drones9040241",
        "year": 2025,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["H. Sharma", "Harjot Sidhu", "Arnab Bhowmik"],
        "venue": "Drones",
        "tldr": "This review evaluates the use of unmanned aerial vehicles (UAVs) in detecting and managing water stress in specialty crops through thermal, multispectral, and hyperspectral imaging.",
        "abstract": ""
      },
      {
        "id": "Multi-resolution",
        "x": -0.7998,
        "y": 0.7012,
        "z": -0.4654,
        "title": "Multi-resolution Pyramid Enhanced Non-local Feature Extraction for Hyperspectral Classification",
        "citations": 6,
        "doi": "10.1109/jstars.2022.3189105",
        "year": 2022,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["Bing Tu", "Xiaolong Liao", "Qianming Li", "Chengle Zhou", "A. Plaza"],
        "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
        "tldr": "Hyperspectral image (HSI) is applied to accurately distinguish ground objects in many fields, owing to its abundant structural and spectral information.",
        "abstract": ""
      },
      {
        "id": "Tighnari",
        "x": -0.3866,
        "y": 0.5156,
        "z": -0.3481,
        "title": "ID: 2501.02649 | Year: 2025",
        "citations": 0,
        "doi": "",
        "year": 2023,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": [],
        "venue": "Academic Conference",
        "tldr": "",
        "abstract": ""
      },
      {
        "id": "Semantic",
        "x": -0.6473,
        "y": 0.3506,
        "z": -0.2137,
        "title": "Semantic Segmentation of Crops via Hyperspectral PRISMA Satellite Images",
        "citations": 2,
        "doi": "10.5220/0012705700003696",
        "year": 2024,
        "clusterId": 9,
        "color": "#E6AB02",
        "size": 0.2,
        "authors": ["Manilo Monaco", "Angela Sileo", "Diana Orlandi", "M. Battagliere", "Laura Candela", "M. G. Cimino", "G. A. Vivaldi", "Vincenzo Giannico"],
        "venue": "International Conference on Geographical Information Systems Theory, Applications and Management",
        "tldr": ": Data from hyperspectral remote sensing are promising to extract and classify crop characteristics, because it provides accurate and continuous spectral signatures of crops.",
        "abstract": ""
      }
    ]
  },
  {
    "id": "10",
    "clusterId": 10,
    "name": "Topic 9: Urban Building Index Thres",
    "color": "#1F78B4",
    "pointCount": 10,
    "centroid": {
      "x": -1.7044,
      "y": -1.4459,
      "z": -0.5446
    },
    "points": [
      {
        "id": "Temporally",
        "x": -1.6323,
        "y": -1.4531,
        "z": -0.2902,
        "title": "Temporally extrapolating object-based threshold for updating urban extents from nighttime light data",
        "citations": 0,
        "doi": "10.1109/IGARSS.2016.7729460",
        "year": 2016,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["Yanhua Xie", "Qihao Weng"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "This study proposed an object-based method to estimate the relationship of optimal thresholds in different The Defense Meteorological Satellite Program/Operational Linescan System (DMSP/OLS) nighttime light (NTL) images for the purpose of mapping large-scale urban dynamics.",
        "abstract": ""
      },
      {
        "id": "Praktykowa",
        "x": -1.6294,
        "y": -1.3583,
        "z": -0.8432,
        "title": "Praktykować media/Praktykować siebie… O doświadczaniu przestrzeni późnej nowoczesności",
        "citations": 0,
        "doi": "10.21697/zk.2021.8.01",
        "year": 2021,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["K. Banaszkiewicz"],
        "venue": "Załącznik kulturoznawczy",
        "tldr": "In advanced globalization, the digital code, computer, and Internet become tools of cultural change.",
        "abstract": ""
      },
      {
        "id": "ONLINE",
        "x": -1.6685,
        "y": -1.6404,
        "z": -0.4752,
        "title": "ONLINE MAPS AND CLOUD-SUPPORTED LOCATION-BASED SERVICES ACROSS A MANIFOLD OF DEVICES",
        "citations": 3,
        "doi": "10.5194/ISPRSANNALS-I-4-151-2012",
        "year": 2012,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["M. Kroepfl", "Daniel Buchmueller", "F. Leberl"],
        "venue": "Academic Conference",
        "tldr": "In this paper, we provide an example of a simple geospatial application making use of this model, which we will use to explain the basic steps necessary to deploy an application involving a web service hosting geospatial information and a client software consuming the web service through an API.",
        "abstract": ""
      },
      {
        "id": "Country-Scale",
        "x": -1.8107,
        "y": -1.5279,
        "z": -0.4448,
        "title": "Country-Scale Photogrammetry and True Orthorectification Using Very-High-Resolution (VHR) Multi-View Satellite Imagery",
        "citations": 2,
        "doi": "10.1109/IGARSS52108.2023.10281555",
        "year": 2023,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["Nicholas Maxwell", "John Papadakis", "A. Ilie", "Craig Stutts", "Joseph Bates", "B. L. Raskob"],
        "venue": "IEEE International Geoscience and Remote Sensing Symposium",
        "tldr": "This paper presents a fully automated system capable of processing country-scale archives of Very High Resolution (VHR) multi-view imagery.",
        "abstract": ""
      },
      {
        "id": "Urban",
        "x": -1.7066,
        "y": -1.321,
        "z": -0.324,
        "title": "Urban Impervious Surface Automatic Threshold Detection Model Derived From Multitemporal Landsat Images",
        "citations": 9,
        "doi": "10.1109/TGRS.2021.3089581",
        "year": 2022,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["Yuliang Wang", "Mingshi Li"],
        "venue": "IEEE Transactions on Geoscience and Remote Sensing",
        "tldr": "In this article, we proposed a novel UIS index and an improved particle swarm optimization (PSO)-based UIS automatic threshold selection model (UISAT) to overcome those shortages when detecting UIS derived from multitemporal Landsat images.",
        "abstract": ""
      },
      {
        "id": "The",
        "x": -1.846,
        "y": -1.2202,
        "z": -0.6412,
        "title": "The Production of Assets Inventory by using a 360-degree Camera Mobile Mapping System in Langkawi, Malaysia",
        "citations": 1,
        "doi": "10.1088/1755-1315/767/1/012012",
        "year": 2021,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["S. Abdullah", "K. N. Tahar", "M. F. A. Rashid", "M. A. Osoman", "F. Abdullah"],
        "venue": "Academic Conference",
        "tldr": "Asset management system is a crucial element of a utility project because it helps a company to inspect the asset inventory systematically.",
        "abstract": ""
      },
      {
        "id": "An",
        "x": -1.5197,
        "y": -1.6186,
        "z": -0.6776,
        "title": "An urban-rural Fringe extraction method based on Combined Urban-rural Fringe Index (CUFI)",
        "citations": 10,
        "doi": "10.1080/10106049.2024.2311211",
        "year": 2024,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["Hongrui Duan", "Fuguang Du", "Yajing Zhang", "Xiaojun Jiang", "Bowei Chen"],
        "venue": "Geocarto International",
        "tldr": "Abstract In this article, a multi-source data-based method for urban-rural fringe extraction is proposed to solve the problem of insufficiently accurate division of urban-rural fringe, which can conveniently and accurately realise the extraction of the area of urban-rural fringe.",
        "abstract": ""
      },
      {
        "id": "Shadow",
        "x": -1.7893,
        "y": -1.6293,
        "z": -0.3369,
        "title": "Shadow Buildings analysis for seismic damage assesment",
        "citations": 0,
        "doi": "10.1109/M2GARSS57310.2024.10537497",
        "year": 2024,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["S. Saadi", "Khadidja Abbes", "Baya Nait Amara"],
        "venue": "2024 IEEE Mediterranean and Middle-East Geoscience and Remote Sensing Symposium (M2GARSS)",
        "tldr": "After a natural disaster occurrence, such as earthquakes, the remote sensing often remains a substantial way to detect the extent of disaster.",
        "abstract": ""
      },
      {
        "id": "A",
        "x": -1.8539,
        "y": -1.3444,
        "z": -0.5653,
        "title": "A method for urban population density prediction at 30m resolution",
        "citations": 13,
        "doi": "10.1080/15230406.2019.1687014",
        "year": 2020,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["K. Balakrishnan"],
        "venue": "Academic Conference",
        "tldr": "ABSTRACT This paper proposes a new method for urban population density prediction at 30 m resolution.",
        "abstract": ""
      },
      {
        "id": "Variation",
        "x": -1.5872,
        "y": -1.3456,
        "z": -0.8475,
        "title": "Variation Characteristics of Building Height Types in the Vertical Urban Expansion Process",
        "citations": 2,
        "doi": "10.15244/pjoes/139742",
        "year": 2021,
        "clusterId": 10,
        "color": "#1F78B4",
        "size": 0.2,
        "authors": ["Peifeng Zhang", "Zheng Cheng", "Jianfeng Xu", "Yuning Dai", "Xiaolin Qi", "Ruigang Chen", "Xin Li", "Neng Zhang", "Zuo Li"],
        "venue": "Polish Journal of Environmental Studies",
        "tldr": "The evolution of building height types in three-dimensional (3D) space is important for urban planning and urban atmospheric environment.",
        "abstract": ""
      }
    ]
  }
];

export const ALL_REAL_POINTS: RealClusterPoint[] = [
  {
    "id": "00b1e7a7e1eb",
    "x": 1.8398,
    "y": -2.1186,
    "z": -0.409,
    "title": "Monitoring and Detection of Volcanic Activity in Near Real-Time Using Intelligent Distributed Satellite Systems",
    "citations": 2,
    "doi": "10.1109/IGARSS52108.2023.10282765",
    "year": 2023,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Kathiravan Thangavel", "Dario Spiller", "Stefania Amici", "Roberto Sabatini"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "Volcanic eruptions are a natural hazard that can devastate people and property.",
    "abstract": "Volcanic eruptions are a natural hazard that can devastate people and property. In recent years, the number of volcanic eruptions has been on the rise, and the effects of climate change are making them more frequent and more powerful. This research proposes a new methodology for monitoring volcanoes in real-time or very close to real-time using an intelligent Distributed Satellite System (iDSS). The iDSS is made up of a constellation of satellites that are all connected to one another by means of Inter-Satellite Links (ISL). This allows the data to be processed and distributed in real-time, which is essential for early warning of volcanic eruptions. In previous studies, the on-board volcanic eruption detection was proven to be possible and feasible by utilising appropriate Artificial Intelligence (AI) techniques. Multispectral optical data were used to assess if an active volcanic eruption was captured in the image. The proposed iDSS architecture is practical and can be used to monitor volcanoes in real-time or near real-time. The system has been tested by taking Mount Etna as a case study and the results have been reported. The findings and conclusions of this research can be applied to and expanded upon in the context of similar natural disasters occurring around the globe."
  },
  {
    "id": "00b456dd9817",
    "x": 1.4923,
    "y": -1.4037,
    "z": 0.081,
    "title": "High-Precision Multi-Source Fusion Navigation Solutions for Complex and Dynamic Urban Environments",
    "citations": 10,
    "doi": "10.3390/rs17081371",
    "year": 2025,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Long Li", "W. Nie", "Wenpeng Zong", "Tianhe Xu", "Mowen Li", "Nan Jiang", "Wei Zhang"],
    "venue": "Remote Sensing",
    "tldr": "To address this issue, we propose a multi-source fusion navigation algorithm tailored for dynamic urban canyon scenarios, aiming to achieve reliable and continuous state estimation in complex environments.",
    "abstract": "With the rapid advancement of artificial intelligence, particularly in fields such as autonomous driving, drone delivery, and logistics automation, the demand for high-precision and robust navigation services has become critical. In complex and dynamic urban environments, the navigation capabilities of single-sensor systems struggle to meet the practical requirements of autonomous driving technology. To address this issue, we propose a multi-source fusion navigation algorithm tailored for dynamic urban canyon scenarios, aiming to achieve reliable and continuous state estimation in complex environments. In our proposed method, we utilize independent threads on a graphics processing unit (GPU) to perform real-time detection and removal of dynamic objects in visual images, thereby enhancing the visual accuracy of multi-source fusion navigation in dynamic scenes. To tackle the challenges of significant Global Navigation Satellite System (GNSS) positioning errors and limited satellite availability in urban canyon environments, we introduce a specialized GNSS Real-Time Kinematic (RTK) stochastic model for such settings. The navigation performance of the proposed algorithm was evaluated using public datasets. The results demonstrate that our RTK/INS/Vision integrated navigation algorithm effectively improves both accuracy and availability in dynamic urban canyon environments."
  },
  {
    "id": "00c70ab78b1c",
    "x": 1.0277,
    "y": -1.2782,
    "z": 0.12,
    "title": "Detecting Forest Degradation in the Three-North Forest Shelterbelt in China from Multi-Scale Satellite Images",
    "citations": 26,
    "doi": "10.3390/rs13061131",
    "year": 2021,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Tao Yu", "Pengju Liu", "Qiang Zhang", "Yizhe Ren", "Jingning Yao"],
    "venue": "Remote Sensing",
    "tldr": "In this paper, a quick and applicable approach was developed for monitoring forest degradation in the Three-North Forest Shelterbelt in China from multi-scale remote sensing data.",
    "abstract": "Detecting forest degradation from satellite observation data is of great significance in revealing the process of decreasing forest quality and giving a better understanding of regional or global carbon emissions and their feedbacks with climate changes. In this paper, a quick and applicable approach was developed for monitoring forest degradation in the Three-North Forest Shelterbelt in China from multi-scale remote sensing data. Firstly, Normalized Difference Vegetation Index (NDVI), Enhanced Vegetation Index (EVI), Ratio Vegetation Index (RVI), Leaf Area Index (LAI), Fraction of Photosynthetically Active Radiation (FPAR) and Net Primary Production (NPP) from remote sensing data were selected as the indicators to describe forest degradation. Then multi-scale forest degradation maps were obtained by adopting a new classification method using time series MODerate Resolution Imaging Spectroradiometer (MODIS) and Landsat Enhanced Thematic Mapper Plus (ETM+) images, and were validated with ground survey data. At last, the criteria and indicators for monitoring forest degradation from remote sensing data were discussed, and the uncertainly of the method was analyzed. Results of this paper indicated that multi-scale remote sensing data have great potential in detecting regional forest degradation."
  },
  {
    "id": "00e72e3ef8ab",
    "x": 1.671,
    "y": -1.5767,
    "z": 0.6115,
    "title": "Methods and algorithms for identifying special points in images obtained from an onboard photo video recorder of an unmanned aerial vehicle",
    "citations": 0,
    "doi": "10.21869/2223-1536-2025-15-1-91-116",
    "year": 2025,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["I. N. Gorbachev", "R. Tomakova", "S. Korobkov"],
    "venue": "Proceedings of the Southwest State University. Series: IT Management, Computer Science, Computer Engineering. Medical Equipment Engineering",
    "tldr": "The purpose of the research is to develop methods for controlling unmanned aerial vehicles based on the analysis of data coming from a video stream.Methods.",
    "abstract": "The purpose of the research is to develop methods for controlling unmanned aerial vehicles based on the analysis of data coming from a video stream.Methods. An unmanned aerial vehicle can lose contact with the satellite navigation system, so the task of ensuring its orientation using an onboard photo video recorder with onboard data processing becomes relevant. For this purpose, special points on the terrain are used, the identification of which in the picture allows restoring the orientation of the aircraft. To search for special points of the blob type in the picture, a method is proposed for transforming the original image into a criterion image, after threshold processing of which the coordinates of the blobs are obtained. A method has been developed for transforming the original image into a criterion image, which consists in determining correlation images. For each correlation image, a scalar blob identification criterion is determined, which allows determining the coordinates of a special point in pictures obtained from an onboard photo video recorder.Results. To improve the accuracy of determining the coordinates of blobs in pictures, an aggregated blob of three special points was used. An algorithm for two-stage identification of coordinates of an aggregated blob is investigated. At the first stage, the coordinates of special points closest to the coordinates of the vertices of the aggregated blob are determined, and at the second stage, the coordinates of the vertices of the triangle whose center of gravity is closest to the center of gravity of the aggregated blob are determined. The algorithms for searching for special points have shown their efficiency at a high level of interference modeled in the image by means of Gaussian noise, as well as interference associated with the deviation of the aircraft from the specified course.Conclusion. The formation of an aggregated blob with subsequent multi-stage identification allows for increasing the accuracy of determining its coordinates, and also makes it possible to record the deviation from the course of the aircraft in the area of two adjacent images and introduce appropriate corrections into the navigation system."
  },
  {
    "id": "017d98857b17",
    "x": 2.2442,
    "y": -1.042,
    "z": 0.922,
    "title": "Оценка разносезонных изображений Sentinel-2 для классификации лесного покрова водоохранных зон рек Марийского Заволжья",
    "citations": 1,
    "doi": "10.25686/2306-2827.2023.2.77",
    "year": 2023,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["\u041b. \u0412. \u0422\u0430\u0440\u0430\u0441\u043e\u0432\u0430", "\u042d. \u0410. \u041a\u0443\u0440\u0431\u0430\u043d\u043e\u0432", "\u041e. \u041d. \u0412\u043e\u0440\u043e\u0431\u044c\u0451\u0432", "\u0421. \u0410. \u041b\u0435\u0436\u043d\u0438\u043d"],
    "venue": "Vestnik of Volga State University of Technology Series Forest. Ecology. Nature Management",
    "tldr": "Водоохранные (защитные) леса являются уязвимыми экосистемами с характерными растительными сообществами, произрастающими на относительно богатых пойменных землях, что отличает их от других лесных насаждений.",
    "abstract": "\u0412\u0432\u0435\u0434\u0435\u043d\u0438\u0435. \u0412\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0435 (\u0437\u0430\u0449\u0438\u0442\u043d\u044b\u0435) \u043b\u0435\u0441\u0430 \u044f\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0443\u044f\u0437\u0432\u0438\u043c\u044b\u043c\u0438 \u044d\u043a\u043e\u0441\u0438\u0441\u0442\u0435\u043c\u0430\u043c\u0438 \u0441 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u043d\u044b\u043c\u0438 \u0440\u0430\u0441\u0442\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u043c\u0438 \u0441\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u0430\u043c\u0438, \u043f\u0440\u043e\u0438\u0437\u0440\u0430\u0441\u0442\u0430\u044e\u0449\u0438\u043c\u0438 \u043d\u0430 \u043e\u0442\u043d\u043e\u0441\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0431\u043e\u0433\u0430\u0442\u044b\u0445 \u043f\u043e\u0439\u043c\u0435\u043d\u043d\u044b\u0445 \u0437\u0435\u043c\u043b\u044f\u0445, \u0447\u0442\u043e \u043e\u0442\u043b\u0438\u0447\u0430\u0435\u0442 \u0438\u0445 \u043e\u0442 \u0434\u0440\u0443\u0433\u0438\u0445 \u043b\u0435\u0441\u043d\u044b\u0445 \u043d\u0430\u0441\u0430\u0436\u0434\u0435\u043d\u0438\u0439. \u041e\u0446\u0435\u043d\u043a\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u043e \u043b\u0435\u0441\u043d\u043e\u043c \u043f\u043e\u043a\u0440\u043e\u0432\u0435 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u0437\u043e\u043d \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0441\u043e\u0431\u043e\u0439 \u043a\u043b\u044e\u0447\u0435\u0432\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u0434\u043b\u044f \u043f\u043e\u043d\u0438\u043c\u0430\u043d\u0438\u044f \u0430\u043d\u0442\u0440\u043e\u043f\u043e\u0433\u0435\u043d\u043d\u043e\u0433\u043e \u0438 \u043f\u0440\u0438\u0440\u043e\u0434\u043d\u043e\u0433\u043e \u0432\u043b\u0438\u044f\u043d\u0438\u044f \u043d\u0430 \u044d\u0442\u0438 \u044d\u043a\u043e\u0441\u0438\u0441\u0442\u0435\u043c\u044b. \u0414\u043b\u044f \u044d\u0442\u0438\u0445 \u0446\u0435\u043b\u0435\u0439 \u0448\u0438\u0440\u043e\u043a\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u044b\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u043d\u0430 \u043e\u0431\u043b\u0430\u0447\u043d\u043e\u0439 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0435 Google Earth Engine (GEE) \u043f\u043e \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0435 \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445. \u0426\u0435\u043b\u044c \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f \u2013 \u043e\u0446\u0435\u043d\u0438\u0442\u044c \u043f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0441\u043f\u0435\u043a\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432 \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 \u0441\u043d\u0438\u043c\u043a\u043e\u0432 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u0430 Sentinel-2 \u0434\u043b\u044f \u043a\u0430\u0440\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0438 \u043e\u0446\u0435\u043d\u043a\u0438 \u043b\u0435\u0441\u043d\u043e\u0433\u043e \u043f\u043e\u043a\u0440\u043e\u0432\u0430 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u0437\u043e\u043d \u0440\u0435\u043a \u0432 GEE. \u041e\u0431\u044a\u0435\u043a\u0442\u0430\u043c\u0438 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f \u044f\u0432\u0438\u043b\u0438\u0441\u044c \u043b\u0435\u0441\u043d\u044b\u0435 \u043d\u0430\u0441\u0430\u0436\u0434\u0435\u043d\u0438\u044f, \u043f\u0440\u043e\u0438\u0437\u0440\u0430\u0441\u0442\u0430\u044e\u0449\u0438\u0435 \u0432 \u0434\u0432\u0443\u0445\u0441\u043e\u0442\u043c\u0435\u0442\u0440\u043e\u0432\u043e\u0439 \u0431\u0443\u0444\u0435\u0440\u043d\u043e\u0439 (\u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u043e\u0439) \u0437\u043e\u043d\u0435 \u0443\u0447\u0430\u0441\u0442\u043a\u043e\u0432 \u0440\u0435\u043a \u0420\u0443\u0442\u043a\u0430, \u041f\u0430\u0440\u0430\u0442, \u0411\u043e\u043b\u044c\u0448\u0430\u044f \u041a\u043e\u043a\u0448\u0430\u0433\u0430, \u0411\u043e\u043b\u044c\u0448\u043e\u0439 \u041a\u0443\u043d\u0434\u044b\u0448, \u0412\u043e\u043b\u0433\u0430, \u041c\u0430\u043b\u0430\u044f \u041a\u043e\u043a\u0448\u0430\u0433\u0430, \u041c\u0430\u043b\u044b\u0439 \u041a\u0443\u043d\u0434\u044b\u0448, \u0418\u043b\u0435\u0442\u044c, \u042e\u0448\u0443\u0442, \u041e\u0448\u043b\u0430, \u0411\u043e\u043b\u044c\u0448\u0430\u044f \u041e\u0448\u043b\u0430 \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0438 \u041c\u0430\u0440\u0438\u0439 \u042d\u043b \u0432 \u0440\u0430\u043c\u043a\u0430\u0445 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u043e\u0439 \u0441\u0446\u0435\u043d\u044b T38VPH Sentinel-2. \u041c\u0435\u0442\u043e\u0434\u044b \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f. \u0412 \u0440\u0430\u0431\u043e\u0442\u0435 \u0431\u044b\u043b\u0430 \u043f\u0440\u043e\u0432\u0435\u0434\u0435\u043d\u0430 \u0443\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c\u0430\u044f \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u044b\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439 Sentinel-2 \u043c\u0435\u0442\u043e\u0434\u043e\u043c \u00ab\u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e\u0433\u043e \u043b\u0435\u0441\u0430\u00bb (RF \u0430\u043d\u0433\u043b. - Random Forest) \u0432 GEE \u043f\u043e 9 \u043a\u043b\u0430\u0441\u0441\u0430\u043c \u043d\u0430\u0437\u0435\u043c\u043d\u043e\u0433\u043e \u043f\u043e\u043a\u0440\u043e\u0432\u0430 (8 \u043a\u043b\u0430\u0441\u0441\u043e\u0432 \u0434\u0440\u0435\u0432\u0435\u0441\u043d\u044b\u0445 \u043f\u043e\u0440\u043e\u0434 \u0438 1\u2013\u043d\u0435\u043b\u0435\u0441\u043d\u044b\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438). \u041d\u0430 \u043f\u0435\u0440\u0432\u043e\u043c \u044d\u0442\u0430\u043f\u0435 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u044b \u0438 \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u0446\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u0447\u0435\u0442\u044b\u0440\u0435 \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 (\u0437\u0438\u043c\u0430, \u0432\u0435\u0441\u043d\u0430, \u043b\u0435\u0442\u043e, \u043e\u0441\u0435\u043d\u044c) \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f Sentinel-2 \u0441 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u0438\u0445 \u0441\u043f\u0435\u043a\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432. \u041f\u043e\u0441\u043b\u0435 \u044d\u0442\u043e\u0433\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u044b \u043f\u043e \u043f\u044f\u0442\u044c \u043d\u0430\u0438\u0431\u043e\u043b\u0435\u0435 \u0437\u043d\u0430\u0447\u0438\u043c\u044b\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0438\u0441\u0441\u043b\u0435\u0434\u0443\u0435\u043c\u043e\u0433\u043e \u0441\u0435\u0437\u043e\u043d\u0430 \u0438 \u0441\u043e\u0437\u0434\u0430\u043d\u043e \u043e\u0434\u043d\u043e \u043a\u043e\u043c\u0431\u0438\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u043d\u0430 \u0438\u0445 \u043e\u0441\u043d\u043e\u0432\u0435. \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0438 \u0432\u044b\u0432\u043e\u0434\u044b. \u041e\u0431\u0449\u0430\u044f \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043f\u0440\u043e\u0432\u0435\u0434\u0451\u043d\u043d\u043e\u0439 \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u0441\u043e\u0441\u0442\u0430\u0432\u0438\u043b\u0430 87,4 %, \u0430 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442 \u041a\u0430\u043f\u043f\u0430 \u2013 0,84. \u041d\u0430\u0438\u043c\u0435\u043d\u044c\u0448\u0430\u044f \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0435\u0442\u0441\u044f \u043f\u043e \u043a\u043b\u0430\u0441\u0441\u0430\u043c \u00ab\u041e\u043b\u044c\u0445\u0430\u00bb \u0438 \u00ab\u041e\u0441\u0438\u043d\u0430\u00bb \u2013 \u043e\u043a\u043e\u043b\u043e 64 %. \u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043a\u0430\u0437\u0430\u043b\u043e, \u0447\u0442\u043e \u0434\u043b\u044f \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u043f\u043e\u0440\u043e\u0434\u043d\u043e\u0433\u043e \u0441\u043e\u0441\u0442\u0430\u0432\u0430 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u043b\u0435\u0441\u043e\u0432 \u043d\u0430\u0438\u0431\u043e\u043b\u0435\u0435 \u043f\u0440\u0438\u0435\u043c\u043b\u0435\u043c\u044b \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u0441\u043f\u0435\u043a\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0435 \u043a\u0430\u043d\u0430\u043b\u044b \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u0430 Sentinel-2 \u2013 \u0432\u0435\u0433\u0435\u0442\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u043a\u0440\u0430\u0439\u043d\u0438\u0439 \u043a\u0440\u0430\u0441\u043d\u044b\u0439 \u043b\u0435\u0442\u043d\u0435\u0433\u043e \u0438 \u043e\u0441\u0435\u043d\u043d\u0435\u0433\u043e \u0441\u0435\u0437\u043e\u043d\u043e\u0432, \u0430 \u0442\u0430\u043a\u0436\u0435 \u043a\u043e\u0440\u043e\u0442\u043a\u043e\u0432\u043e\u043b\u043d\u043e\u0432\u044b\u0439 \u0438\u043d\u0444\u0440\u0430\u043a\u0440\u0430\u0441\u043d\u044b\u0439 \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d \u0432\u0435\u0441\u0435\u043d\u043d\u0435\u0433\u043e \u0438 \u043e\u0441\u0435\u043d\u043d\u0435\u0433\u043e \u0441\u0435\u0437\u043e\u043d\u0430. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0431\u043b\u0430\u0447\u043d\u044b\u0445 \u0432\u044b\u0447\u0438\u0441\u043b\u0435\u043d\u0438\u0439 \u0437\u043d\u0430\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0443\u043f\u0440\u043e\u0449\u0430\u0435\u0442 \u043f\u0440\u043e\u0446\u0435\u0441\u0441 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u0438 \u0430\u043d\u0430\u043b\u0438\u0437\u0430 \u0441\u043f\u0443\u0442\u043d\u0438\u043a\u043e\u0432\u044b\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439, \u0430 \u043f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0440\u0430\u0437\u043d\u043e\u0441\u0435\u0437\u043e\u043d\u043d\u044b\u0445 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439 \u0438 \u0432\u044b\u0431\u043e\u0440 \u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0445 \u043a\u0430\u043d\u0430\u043b\u043e\u0432 \u043c\u043e\u0433\u0443\u0442 \u043f\u043e\u0432\u044b\u0441\u0438\u0442\u044c \u0442\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043a\u043b\u0430\u0441\u0441\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438 \u0432\u043e\u0434\u043e\u043e\u0445\u0440\u0430\u043d\u043d\u044b\u0445 \u043b\u0435\u0441\u043e\u0432.  Introduction. Riparian forests are vulnerable ecosystems with specific plant communities growing in relatively rich floodplain soils, which distinguishes them from other forest plantations. The assessment of data on forest cover in riparian zones provides the key information for understanding anthropogenic and natural impacts on these ecosystems. For these purposes, satellite images are widely used, which are available on the Google Earth Engine (GEE) cloud platform for global data processing. The aim of the study is to evaluate the use of spectral bands of Sentinel-2 satellite multi-season images for mapping and assessing the forest cover of riparian zones in GEE. The objects of the study were forest plantations growing in a 200-meter buffer (water protection) zone of the rivers Rutka, Parat, Bolshaya Kokshaga, Bolshoy Kundysh, Volga, Malaya Kokshaga, Maly Kundysh, Ilet, Yushut, Oshla, and Bolshaya Oshla of the Republic of Mari El, within the framework of Sentinel-2 satellite scene T38VPH. Research methods. Supervised classification of Sentinel-2 satellite multi-season images was carried out on the basis of the random forest (RF) method in GEE according to 9 classes of land cover (8 classes of tree species and 1 - non-forest areas). At the first stage of the study, four multi-season (winter, spring, summer, autumn) Sentinel-2 images were created and classified using several spectral bands. After that, five most significant bands of the images for each studied season were selected and one combined image was created based on them. Results and conclusions. The overall accuracy of the classification was 87.4%, and the Kappa coefficient was 0.84. The lowest accuracy rate of approximately 64% was found for the Alder and Aspen classes. The study showed that the following spectral bands of the Sentinel-2 satellite are most suitable for classifying the species composition of riparian forests: the vegetation red edge band of the summer and autumn seasons, as well as the short-wave infrared range of the spring and autumn seasons. The use of cloud computing greatly simplifies satellite image processing and analysis, while the use of multi-season images and the selection of appropriate bands can improve the accuracy of riparian forest classification."
  },
  {
    "id": "01cefcfab510",
    "x": 1.9314,
    "y": -0.8363,
    "z": 0.1254,
    "title": "Autonomous Image Georeferencing Based on Database Image Matching",
    "citations": 2,
    "doi": "10.1109/ICARES.2018.8547086",
    "year": 2018,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["P. R. Hakim", "Ade Putri Septi Jayani", "A. Sarah", "W. Hasbi"],
    "venue": "2018 IEEE International Conference on Aerospace Electronics and Remote Sensing Technology (ICARES)",
    "tldr": "As an experimental remote sensing microsatellite, LAPAN-A3/IPB satellite has been continuously producing daily multispectral images for monitoring Indonesian archipelago.",
    "abstract": "As an experimental remote sensing microsatellite, LAPAN-A3/IPB satellite has been continuously producing daily multispectral images for monitoring Indonesian archipelago. The autonomous image preprocessing software has been developed to process raw image into systematically corrected image, except for high level image georeferencing process which is still conducted manually. This research aims to develop an autonomous image georeferencing for LAPAN-A3/IPB multispectral images so that entire image preprocessing can be executed autonomously. The algorithm is based on template image matching approach, by using numerous of previously processed images. The developed algorithm has been well validated and successfully georeferences LAPAN-A3/IPB multispectral images with a good accuracy. The time needed for the algorithm to process single image can be considered very fast, therefore the algorithm can be integrated into already established image preprocessing software. With this fully autonomous image preprocessing, each raw image captured could be processed inside one hour since its acquisition, allowing fast and consistent image distribution to the end user."
  },
  {
    "id": "01d10dfdff4a",
    "x": 0.4683,
    "y": -2.0049,
    "z": 0.6553,
    "title": "Machine learning approach to extract building footprint from high-resolution images: the case study of Makkah, Saudi Arabia",
    "citations": 6,
    "doi": "10.1093/IJLCT/CTAA099",
    "year": 2021,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Kamil Faisal", "A. Imam", "A. Majrashi", "I. Hegazy"],
    "venue": "International Journal of Low-Carbon Technologies",
    "tldr": "Extracting and identifying building boundaries from high-resolution images have been a hot topic in the field of remote sensing for years.",
    "abstract": "Extracting and identifying building boundaries from high-resolution images have been a hot topic in the field of remote sensing for years. Various methods including geometric, radiometric, object based and edge detection were previously deliberated and implemented in different studies in the context of building extraction. Nevertheless, the reliability of extraction process is mainly subject to user intervention. The current study proposes a new automatic morphology-based approach for extracting buildings using high-resolution satellite images of Al-Hudaybiyah region in the city of Makkah as a case study. The proposed technique integrates the support vector machine for extracting buildings that have bright and dark roofs. The appropriateness of this method has been examined by means of various indicators for example completeness, correctness and quality. Preliminary findings will illustrate the precision and accuracy of the used machine learning algorithm. Research results can provide a generic indicator to assist the planning authorities in achieving better urban planning processes taking into account all potential environmental, social and urban demands and requirements."
  },
  {
    "id": "01f40b5c0f9f",
    "x": 2.0356,
    "y": -1.6607,
    "z": 0.227,
    "title": "Using the method of image decomposition based on topological features for processing satellite images",
    "citations": 0,
    "doi": "10.47148/1609-364x-2023-4-74-80",
    "year": 2023,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["S. Eremeev", "A. Abakumov", "Sergey A. Krainov", "A. Kozlov"],
    "venue": "Geoinformatika",
    "tldr": "The problem of interpretation of spatial data on satellite images is considered in the article.",
    "abstract": "The problem of interpretation of spatial data on satellite images is considered in the article. It is proposed to use the decomposition of images by topological features to highlight objects of interest, global and detailed structures on satellite images. The description of the method and the features of its implementation for creating a software product with effective algorithms for processing big data are given. The functionality of the developed software, which includes the classification of objects on satellite images, segmentation, binarization, noise removal is described. It is shown that these algorithms are built on a single theoretical basis in the form of a topological decomposition. Examples of using the program for segmentation and binarization of satellite images from urban neighborhoods are demonstrated."
  },
  {
    "id": "02649373a017",
    "x": 2.1623,
    "y": -1.2786,
    "z": 0.8021,
    "title": "Sat-Crop transformer: integrating temporal satellite imagery and GAN-based synthesis for vegetation health monitoring",
    "citations": 0,
    "doi": "10.1117/1.JRS.20.024515",
    "year": 2026,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Hemalatha Munusamy", "Jashvinu Yeshwanth Raj", "D. Mani", "A. M. B. Deepak Athipan"],
    "venue": "Journal of Applied Remote Sensing",
    "tldr": "We introduce an innovative approach that integrates satellite imagery analysis and predictive modeling to predict vegetation indices and generate synthetic field images.",
    "abstract": "Abstract. Monitoring vegetation health is vital for environmental management, agriculture, and land use planning. We introduce an innovative approach that integrates satellite imagery analysis and predictive modeling to predict vegetation indices and generate synthetic field images. We propose the Sat-Crop Transformer, a transformer-based model specifically designed for satellite crop monitoring for the prediction of crop health. Historical satellite imagery data, including vegetation indices such as the modified soil-adjusted vegetation index and environmental parameters, are used to predict future vegetation indices. The Sat-Crop Transformer demonstrates better performance in capturing long-range dependencies in temporal satellite data. A generative adversarial network\u2013based approach is used to generate synthetic field images corresponding to the predicted vegetation indices, thereby enhancing the data visualization and model training. This integration of advanced predictive modeling and image generation provides a deeper understanding of environmental processes and supports decision-making in various domains."
  },
  {
    "id": "026ca3492a44",
    "x": 1.4378,
    "y": -1.528,
    "z": -1.0168,
    "title": "Research on the current state of Shatsk Lakes using remote sensing of the Earth",
    "citations": 0,
    "doi": "10.17721/phgg.2025.48.1/129.03",
    "year": 2025,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Oksana M. Pidkova"],
    "venue": "Physical Geography and Geomorphology",
    "tldr": "Shatsk Lakes, located within the Shatsk National Nature Park, are characterized by a number problems of a natural and anthropogenic nature, which worsen the ecological condition of both the lakes themselves and the natural complexes around them.",
    "abstract": "Shatsk Lakes, located within the Shatsk National Nature Park, are characterized by a number problems of a natural and anthropogenic nature, which worsen the ecological condition of both the lakes themselves and the natural complexes around them. The current state of Shatsk Lakes was analyzed using remote sensing methods. The main emphasis was placed on the study of Lake Svitiaz, as the largest lake in the Shatsk Lakes group and the main tourist attraction in the region. By analyzing satellite images on the online services Copernicus Browser and Google Earth Engine, changes in lake water content during 2017-2024 was analyzed, the phenomenon of eutrophication was investigated using the NDVI index for the period 2020-2024, and multi-temporal maps of land cover types and a map of projected changes in land cover types in the Shatsk Lakes area by 2050 were created. Based on the conducted research, it was found that the main environmental problems of this region are decreasing water content of lakes, shallowing, eutrophication processes, development of coastal zones. These processes tend to progress, which will have a negative impact on the entire ecosystem of Shatsk Lakes and worsen the functioning of this nature conservation area."
  },
  {
    "id": "028430030226",
    "x": 0.4974,
    "y": -1.2582,
    "z": 0.3562,
    "title": "Neural Networks for Content-Based Image Retrieval",
    "citations": 6,
    "doi": "10.4018/978-1-59904-370-8.CH012",
    "year": 2007,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["B. Verma", "S. Kulkarni"],
    "venue": "Academic Conference",
    "tldr": "This chapter introduces neural networks for content-based image retrieval (CBIR) systems.",
    "abstract": "This chapter introduces neural networks for content-based image retrieval (CBIR) systems. It presents a critical literature review of both the traditional and neural network-based techniques that are used to retrieve images based on their content. It shows how neural networks and fuzzy logic can be used in the interpretation of queries, feature extraction, and classification of features by describing a detailed research methodology. It investigates a neural network-based technique in conjunction with fuzzy logic to improve the overall performance of CBIR systems. The results of the investigation on a benchmark database with a comparative analysis are presented in this chapter. The methodologies and results presented in this chapter will allow researchers to improve and compare their methods, and it also will allow system developers to understand and implement the neural network and fuzzy logic-based techniques for content-based image retrieval. 701 E. Chocolate Avenue, Suite 200, Hershey PA 17033-1240, USA Tel: 717/533-8845; Fax 717/533-8661; URL-http://www.irm-press.com ITB13861 IRM PRESS This chapter appears in the book, Semantic-Based Visual Information Retrieval by Y.J. Zhang \u00a9 2007, Idea Group Inc. Neural Networks for Content-Based Image Retrieval Copyright \u00a9 2007, Idea Group Inc. Copying or distributing in print or electronic forms without written permission of Idea Group Inc. is prohibited. Introduction Recent technological advances in computer-based storage, transmission, and display of image data and the Internet have made it possible to process and store large amounts of image data. Perhaps the most impressive example is the fast accumulation of image data in scientific applications such as medical and satellite imagery. The Internet is another excellent example of a distributed database containing several million images. In recent years, there has been a rapid increase in the size of digital image collections. Retrieving images from large collections effectively and efficiently based on their content has become an important research issue for database, image-processing, and computer-vision communities. Creating and storing digital images nowadays is easy and getting cheaper all the time as the needed technologies are becoming available. There already is a vast number of digital visual data sources (e.g., various kinds of sensors, digital cameras, and scanners) in addition to the various image collections and databases for all kinds of purposes. Furthermore, the fast development of computing hardware has enabled us to switch from text-based computing to graphical user interfaces (GUIs) and multimedia applications. This transaction has fundamentally changed the use of computers and made visual information an inseparable part of everyday computing. As a result, the amount of information in visual form is increasing, and we need effective ways to process it. The existing and widely adopted methods for text-based data usually are inadequate for these purposes. Visual information generally is said to include both still images and moving videos. It is well-known that a successful CBIR system will have a large number of applications. Although many CBIR systems have been built, the performance of these systems is far from the demands of various applications. The aim of CBIR research is to retrieve desired images from such large collections automatically. Toward this goal, automatic CBIR systems have become an active research area in the last decade. One of the solutions is the development of automated methods that are able to recognize the composition and content of the images and to make use of the recognized image content in order to achieve content-based image retrieval. Such kinds of image retrieval systems involve a great deal of image understanding and machine intelligence. In addition, an ideal system should allow both a keyword and a concept search in conjunction with a content-based search. This already can be seen in many image retrieval systems. However, most of them do not provide flexibility in formulating these queries. At the start, the user should be able either to issue a direct query or to query by example. There is no good or proven way to search for and retrieve images from databases without annotation. Given the enormous amount of images stored on computers, annotation is becoming more and more impractical, and the need for an automatic feature identification based on image retrieval is growing. Techniques that are based on neural networks also have been developed for CBIR. The main reason for using neural networks in CBIR is due to their adaptive learning capability. Neural networks offer unsupervised clustering as well as supervised learning mechanisms for the retrieval of images. Recent research in image retrieval suggests that significant improvement in retrieval performance requires techniques that, in some sense, \u201cunderstand\u201d the content of the image and queries. Recently, image retrieval researchers have used the application domain knowledge to determine relevant relationships between images and queries. The aim of the research presented in this chapter is to show the possibility of learning and use of domain knowledge in an image retrieval application by means of the learning and generalization capabilities of neural networks. 19 more pages are available in the full version of this document, which may be purchased using the \"Add to Cart\" button on the publisher's webpage: www.igi-global.com/chapter/neural-networks-content-basedimage/28930"
  },
  {
    "id": "02961229198d",
    "x": 1.309,
    "y": -1.0046,
    "z": 0.6188,
    "title": "Deployment of Attention-based VGG19 with Deep SVM for Soil Moisture and Vegetation Index Prediction in Agriculture Field using Satellite Images",
    "citations": 0,
    "doi": "10.1109/ICOSEC67334.2025.11459783",
    "year": 2025,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["M. A. Nagasai", "S.Maruthupermal"],
    "venue": "2025 6th International Conference on Smart Electronics and Communication (ICOSEC)",
    "tldr": "Variation in soil moisture content can greatly affect crop growth and agricultural productivity.",
    "abstract": "Variation in soil moisture content can greatly affect crop growth and agricultural productivity. While soil moisture provides needed water for plants, excessive soil moisture can hinder crop growth. Therefore, it is necessary to develop effective methods for analyzing normal soil moisture levels before the harvesting period of crops to boost agricultural output. It helps predict and analyze water cycles, climate crises, water vapour transport, drought, water management, and overflow during rainfall. In particular, the conventional technique for measuring habitat structure has difficulty in understanding variation among habitat categories due to the complex patterns. In agricultural settings, the integration of aerial and satellite imagery techniques has improved the ability to monitor the yields. In this study, an effective attention-based deep learning method is proposed for the prediction of soil moisture and vegetation index analysis. Firstly, the required samples of satellite images are garnered from the benchmark datasets. Consequently, the input images are processed under Attention-based Visual Geometry Group 19 with Deep Support Vector Machine (A-VGG19-DSVM) for predicting the soil moisture and vegetation index level. Lastly, the experimentation of the proposed model is assessed with distinct evaluation metrics. On the contrary, the results are obtained by the proposed method to prove the efficacy."
  },
  {
    "id": "02f48e96155d",
    "x": 0.9861,
    "y": -2.3628,
    "z": 0.8635,
    "title": "COMPARING THE ACCURACY OF GNSS POSITIONING VARIANTS FOR UAV BASED 3D MAP GENERATION",
    "citations": 4,
    "doi": "10.5194/isprs-archives-xliii-b1-2020-443-2020",
    "year": 2020,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["H. Amlashi", "F. Samadzadegan", "Farzaneh Dadras Javan", "M. Savadkouhi"],
    "venue": "Academic Conference",
    "tldr": "GNSS stands for Global Navigation Satellite System and is the standard generic term for satellite navigation systems that provide autonomous geo-spatial positioning with global coverage.",
    "abstract": "Abstract. GNSS stands for Global Navigation Satellite System and is the standard generic term for satellite navigation systems that provide autonomous geo-spatial positioning with global coverage. The advantage of having access to multiple satellites is accuracy, redundancy, and availability at all the times. Though satellite systems do not often fail, if one fails GNSS receivers can pick up signals from other systems. If the line of sight is obstructed, having access to multiple satellites is also a benefit. GPS (Global Positioning System, USA), GLONASS (Global Navigation Satellite System, Russia), BeiDou (Compass, China), and some regional systems are positioning systems that are usually used. In recent years with the development of the UAVs and GNSS receivers, it is possible to manage an accurate PPK (Post Processing Kinematic) networks with a GNSS receiver mounted on a UAV to achieve the position of images principal points WGS1984 and to reduce the need for GCPs. But the most important challenge in a PPK task is, which a combination of different GNSS constellations would result in the most accurate computed position in checkpoints. For this purpose, this study focused on a PPK equipped UAV to map an open pit (Golgohar mine near Sirjan city). For the purpose, different combination of GPS, GLONASS and BeiDou used for position computed. Results are plotted and compared and found out having access to multiple constellations while doing a PPK task would bring higher accuracies in building photogrammetric models although it may cause some random error due to the higher values of noise while the number of the satellites increases."
  },
  {
    "id": "0343c71611f3",
    "x": 0.8361,
    "y": -1.8888,
    "z": 0.8773,
    "title": "Comparative Analysis of Global Solar Radiation Estimation Models - A case study: Algeria",
    "citations": 2,
    "doi": "10.1109/ICAEE47123.2019.9014705",
    "year": 2019,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Benmouiza Khalil", "Cheknane Ali"],
    "venue": "International Conference on Advances in Electrical Engineering",
    "tldr": "Hence, in this paper, we will present a description and classification of some solar radiation estimation models based on ground measurements.",
    "abstract": "Studying of solar radiation is essential to estimate its amount at ground level. In practice, there are two sources of solar data; the first consists of the measured ground data available in meteorological networks and radiometric solar stations. And, the other consists of extracting solar data from digital satellite images. However, only a few stations measured irregularly the amount solar radiation. Hence, in this paper, we will present a description and classification of some solar radiation estimation models based on ground measurements. Moreover, satellite image processing models are also discussed, an improvement of these models using fuzzy logic is also viewed. The validity of these models will be judged by comparing the obtained results by actually measured values of the available ground stations."
  },
  {
    "id": "Anti-satellite",
    "x": 1.2854,
    "y": -0.9711,
    "z": 0.5041,
    "title": "Anti-satellite glia cell IgG antibodies in fibromyalgia patients are related to symptom severity and to metabolite concentrations in thalamus and rostral anterior cingulate cortex.",
    "citations": 40,
    "doi": "10.1016/j.bbi.2023.09.003",
    "year": 2023,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["S. Fanton", "Joana Menezes", "E. Krock", "Angelica Sandstr\u00f6m", "Jeanette Tour", "Katalin Sandor", "A. Jurczak", "Matthew A Hunt", "Azar Baharpoor", "D. Kadetoff", "Karin B. Jensen", "Peter Fransson", "I. Ellerbrock", "R. Sitnikov", "Camilla I. Svensson", "E. Kosek"],
    "venue": "Brain, behavior, and immunity",
    "tldr": "Recent translational work has shown that fibromyalgia (FM) might be an autoimmune condition with pathogenic mechanisms mediated by a peripheral, pain-inducing action of IgG antibodies binding to satellite glia cells (SGC) in the dorsal root ganglia (DRG).",
    "abstract": ""
  },
  {
    "id": "Multiple",
    "x": 1.858,
    "y": -1.0513,
    "z": 0.0881,
    "title": "Multiple roles of syndecan-4 during myoblast migration",
    "citations": 0,
    "doi": "10.14232/phd.10858",
    "year": 2021,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["D\u00e1niel Becsky"],
    "venue": "Academic Conference",
    "tldr": "Background and purpose: Cell migration is one of the cornerstones of regeneration processes, as it is necessary for wound healing, and also required for embryonic development, immune system activation, or tumor metastasis formation.",
    "abstract": ""
  },
  {
    "id": "Bone",
    "x": 2.2074,
    "y": -2.3299,
    "z": -0.0314,
    "title": "Bone marrow derived cells in adult skeletal muscle tissue in humans",
    "citations": 17,
    "doi": "10.1186/2044-5040-3-12",
    "year": 2013,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["A. Str\u00f6mberg", "M. Jansson", "H. Fischer", "E. Rullman", "H. H\u00e4gglund", "T. Gustafsson"],
    "venue": "Skeletal Muscle",
    "tldr": "BackgroundDuring the past decade, several animal studies have demonstrated that in addition to local cells, cells from the bone marrow (BM) possess the ability to contribute to regeneration of injured skeletal muscle tissue.",
    "abstract": ""
  },
  {
    "id": "Cy3",
    "x": 1.7892,
    "y": -1.1545,
    "z": -0.819,
    "title": "Cy3‐Conjugated Biocompatible Polymer Nanoparticles for Long‐Term Mitochondrial Imaging",
    "citations": 0,
    "doi": "10.1002/cbic.70323",
    "year": 2026,
    "clusterId": -1,
    "color": "#aaaaaa",
    "size": 0.2,
    "authors": ["Souma Kawashima", "Mitsuo Inui", "Izumi Takaba", "Haruka Taniguchi", "Koji Nagahama"],
    "venue": "ChemBioChem",
    "tldr": "In this study, we designed modified dye in which biocompatible polymers were covalently attached to Cy3.",
    "abstract": ""
  },
  {
    "id": "Remote",
    "x": 0.8178,
    "y": 1.5264,
    "z": -1.7373,
    "title": "Remote sensing intelligent interpretation for geology: from perspective of geological exploration",
    "citations": 1,
    "doi": "10.1080/00206814.2025.2460040",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Fitria Helmiza"],
    "venue": "Soviet Economy",
    "tldr": "This book offers an in-depth exploration of advanced remote sensing technologies in geological studies.",
    "abstract": ""
  },
  {
    "id": "Hybrid",
    "x": 0.6035,
    "y": 1.5316,
    "z": -1.4468,
    "title": "Hybrid Enriched Stacked Auto Encoder and FFO-MPARCNN Algorithm for the Multispectral Image LULC Classification",
    "citations": 0,
    "doi": "10.21203/RS.3.RS-717451/V1",
    "year": 2021,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Bhuvaneswari E", "Anil Kumar T Ch", "Haqqani Arshad", "Dhanagopal R", "Bharath Kumar Narukullapati"],
    "venue": "Academic Conference",
    "tldr": "The satellite imagery classification task is fundamental to spatial knowledge discovery.",
    "abstract": ""
  },
  {
    "id": "Collective",
    "x": 0.8726,
    "y": 1.5078,
    "z": -1.293,
    "title": "Collective view: mapping Sargassum distribution along beaches",
    "citations": 28,
    "doi": "10.7717/peerj-cs.528",
    "year": 2021,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Javier Arellano-Verdejo", "H. Lazcano-Hernandez"],
    "venue": "PeerJ Computer Science",
    "tldr": "The atypical arrival of pelagic Sargassum to the Mexican Caribbean beaches has caused considerable economic and ecological damage.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.8298,
    "y": 1.2373,
    "z": -1.6107,
    "title": "A hybrid approach for enhanced flood prediction and assessment: Leveraging physical models, deep learning and satellite remote sensing",
    "citations": 26,
    "doi": "10.1080/20964471.2025.2530850",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Mohammad Roohi", "H. Ghafouri", "S. M. Ashrafi", "Mahdi Motagh", "M. Haghshenas Haghighi"],
    "venue": "Academic Conference",
    "tldr": "ABSTRACT Accurate real-time information is crucial for effective flood risk management, especially in regions with complex terrain and irregular rainfall patterns.",
    "abstract": ""
  },
  {
    "id": "Injecting",
    "x": 0.8243,
    "y": 1.4936,
    "z": -1.3257,
    "title": "Injecting spatial priors in Earth observation with machine vision",
    "citations": 0,
    "doi": "10.18174/466814",
    "year": 2019,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Diego Gonz\u00e1lez"],
    "venue": "Academic Conference",
    "tldr": "Remote Sensing (RS) imagery with submeter resolution is becoming ubiquitous.",
    "abstract": ""
  },
  {
    "id": "Automatic",
    "x": 0.7283,
    "y": 1.2514,
    "z": -1.5318,
    "title": "Automatic Feature Extraction from High-Resolution Satellite Imagery using Deep Learning techniques",
    "citations": 1,
    "doi": "10.1109/RAEEUCCI61380.2024.10547851",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Kasarapu Ramani", "A. Chinna", "G. S. Suchith", "G. Reshma", "I. Reddy"],
    "venue": "2024 International Conference on Recent Advances in Electrical, Electronics, Ubiquitous Communication, and Computational Intelligence (RAEEUCCI)",
    "tldr": "This paper introduces an innovative feature extraction approach utilizing Deep learning techniques such as Pix2Pix GAN (Generative Adversarial Network) for semantic segmentation and improving the object delineation, such as land, buildings, roads, and water features, in image-to-image translation tasks.",
    "abstract": ""
  },
  {
    "id": "Domain",
    "x": 0.9639,
    "y": 1.5012,
    "z": -1.317,
    "title": "Domain Adaption for Fine-Grained Urban Village Extraction From Satellite Images",
    "citations": 73,
    "doi": "10.1109/LGRS.2019.2947473",
    "year": 2020,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Q. Shi", "Mengxi Liu", "Xiaoping Liu", "Penghua Liu", "Pengyuan Zhang", "Jinxing Yang", "Xia Li"],
    "venue": "IEEE Geoscience and Remote Sensing Letters",
    "tldr": "In this letter, we propose using the domain adaptation strategy to tackle the domain shift problem by employing adversarial learning to tune the semantic segmentation network so as to adaptively obtain similar outputs for input images from different domains.",
    "abstract": ""
  },
  {
    "id": "RAG",
    "x": 0.5713,
    "y": 1.3057,
    "z": -1.3845,
    "title": "RAG Augmented Explainable Deep Learning for Satellite Image Classification",
    "citations": 0,
    "doi": "10.1109/ICCIDS69108.2026.11407853",
    "year": 2026,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["S. M", "Yesvanthika J", "A. R", "Varalakshmi M", "Peer Mohamed P U"],
    "venue": "2026 9th International Conference on Computational Intelligence in Data Science (ICCIDS)",
    "tldr": "Applications of Land Use Land Cover (LULC) classification span multiple fields, including disaster management, environmental monitoring, climate change studies, Urban planning, policy-making, and beyond.",
    "abstract": ""
  },
  {
    "id": "USAGE",
    "x": 0.8852,
    "y": 1.6136,
    "z": -1.601,
    "title": "USAGE OF CONVOLUTIONAL NEURAL NETWORK FOR MULTISPECTRAL IMAGE PROCESSING APPLIED TO THE PROBLEM OF DETECTING FIRE HAZARDOUS FOREST AREAS",
    "citations": 11,
    "doi": "10.20998/2522-9052.2019.1.19",
    "year": 2019,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Vladyslav Yaloveha", "Daria Hlavcheva", "A. Podorozhniak"],
    "venue": "Advanced Information Systems",
    "tldr": "Neural networks are intensively developed and used in all spheres of human activity in the modern world.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": 0.8645,
    "y": 1.2154,
    "z": -1.6076,
    "title": "An Open-Access Cross-Modal Forest Benchmark Training Dataset With Sentinel-1 and Lidar data",
    "citations": 0,
    "doi": "10.1109/IGARSS55030.2025.11243038",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["H. Aghababaei", "G. Ferraioli", "Gilda Schirinzi", "E. Tomppo", "J. Parks"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "To address the current gap in forest SAR datasets, this paper introduces a new benchmark dataset, comprising pre-processed Sentinel-1 polarimetric interferometric data annotated with forest height information derived from space-based LiDAR data.",
    "abstract": ""
  },
  {
    "id": "Optimizing",
    "x": 0.5511,
    "y": 1.3171,
    "z": -1.2903,
    "title": "ID: 2604.13283 | Year: 2026",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "GPROF-NN",
    "x": 0.5457,
    "y": 1.5846,
    "z": -1.5295,
    "title": "GPROF-NN: a neural-network-based implementation of the Goddard Profiling Algorithm",
    "citations": 34,
    "doi": "10.5194/amt-15-5033-2022",
    "year": 2022,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["S. Pfreundschuh", "P. Brown", "C. Kummerow", "P. Eriksson", "Teodor Norrestad\u200b\u200b\u200b\u200b\u200b\u200b\u200b"],
    "venue": "Atmospheric Measurement Techniques",
    "tldr": "We present two neural-network-based, probabilistic implementations of GPROF: GPROF-NN 1D, which (just like the current GPROF implementation) processes pixels individually, and GPROF-NN 3D, which employs a convolutional neural network to incorporate structural information into the retrieval.",
    "abstract": ""
  },
  {
    "id": "Intelligent",
    "x": 0.8338,
    "y": 1.2651,
    "z": -1.4711,
    "title": "Intelligent Remote Sensing Scene Classification Model for On-Board Training of Resource-Constrained Devices",
    "citations": 2,
    "doi": "10.54216/jchci.090101",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Ahmad Ahmad", "Josef Al Jumayel"],
    "venue": "Journal of Cognitive Human-Computer Interaction",
    "tldr": "Remote Sensing Scene Classification (RSSC) is the distinctive classification of remote sensing images into numerous classes of scene classifications based on the image content.",
    "abstract": ""
  },
  {
    "id": "Land",
    "x": 0.5584,
    "y": 1.4337,
    "z": -1.3854,
    "title": "Land Cover Change Detection Using Convolution Neural Network",
    "citations": 4,
    "doi": "10.1109/ICECA.2019.8821840",
    "year": 2019,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["T. M", "P. P.", "Ravichand S", "A. T"],
    "venue": "2019 3rd International conference on Electronics, Communication and Aerospace Technology (ICECA)",
    "tldr": "In this paper, Land cover classification and change detection is made using high resolution satellite images of Guntur region taken over the years 2013 and 2016 with Landsat-7.",
    "abstract": ""
  },
  {
    "id": "Efficient",
    "x": 0.6224,
    "y": 1.2296,
    "z": -1.3356,
    "title": "Efficient Classification for Intelligent and Robust Satellite Image Encryption",
    "citations": 1,
    "doi": "10.1109/JSTARS.2025.3610790",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Salah-Eddine Tbahriti", "Nabil Boughanmi"],
    "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
    "tldr": "To address this limitation, we propose a dual-stage framework that combines fast, content-aware image classification with high-performance selective encryption.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.737,
    "y": 1.6054,
    "z": -1.5732,
    "title": "A Novel Approach for Oil Spill Detection from SAR Images",
    "citations": 6,
    "doi": "10.1109/ICCEBS58601.2023.10448846",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["D. Roopa", "M. Subashini", "S. Mathupriya", "R. Prabha", "G. Senthil"],
    "venue": "2023 Intelligent Computing and Control for Engineering and Business Systems (ICCEBS)",
    "tldr": "The main aim of this study is to identify instances of oil spills through the use of images taken from satellite.",
    "abstract": ""
  },
  {
    "id": "Segmentation",
    "x": 0.7697,
    "y": 1.6041,
    "z": -1.2888,
    "title": "Segmentation and Evaluation of Water-Bodies from Satellite Images",
    "citations": 0,
    "doi": "10.1109/ICRISET64803.2025.11251940",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["J. Glady", "Jamal Zaidi", "K. Vijayakumar", "Uday Kumar Maurya", "S. Prabha"],
    "venue": "International Conference Emerging Trends Engineering, Science and Technology",
    "tldr": "Remote sensing and image-based assessment methodologies are frequently employed in satellite image-based water body detection to identify, delineate, and monitor lakes, rivers, and reservoirs for environmental management purposes.",
    "abstract": ""
  },
  {
    "id": "UnCRtainTS",
    "x": 0.868,
    "y": 1.6241,
    "z": -1.6755,
    "title": "ID: 2304.05464 | Year: 2023",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Deep-Learning-Based",
    "x": 0.8492,
    "y": 1.2283,
    "z": -1.5405,
    "title": "ID: 2109.00400 | Year: 2021",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Urban",
    "x": 0.65,
    "y": 1.4278,
    "z": -1.3661,
    "title": "Urban Building Function Mapping by Integrating Cross-View Geospatial Data",
    "citations": 0,
    "doi": "10.1109/IGARSS53475.2024.10641009",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Dairong Chen", "Weijia Li", "Hong Fan"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "In the face of rapid urbanization, traditional methods for mapping urban functional zones prove inadequate in both efficiency and scale.",
    "abstract": ""
  },
  {
    "id": "Leveraging",
    "x": 0.8727,
    "y": 1.5688,
    "z": -1.6874,
    "title": "Leveraging Pre-trained Deep Learning Models for Remote Sensing Image Classification: A Case Study with ResNet50 and EfficientNet",
    "citations": 7,
    "doi": "10.11648/j.ajset.20240903.11",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Srivani Bobba"],
    "venue": "American Journal of Science, Engineering and Technology",
    "tldr": "The procedure of categorizing images from remote sensing is also another application of machine learning not just ground-based platforms (for instance satellites), aerial platforms become platforms sometimes in aviation either.",
    "abstract": ""
  },
  {
    "id": "Enhanced",
    "x": 0.9322,
    "y": 1.6522,
    "z": -1.4581,
    "title": "Enhanced synthetic aperture radar image autofocus and classification using 2D SARNet framework",
    "citations": 4,
    "doi": "10.1117/1.JRS.18.026507",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["M. Sakr", "Ahmed Saleh", "F. Abdelkader", "G. Amer", "Mohamed AboElenean"],
    "venue": "Journal of Applied Remote Sensing",
    "tldr": "We present an SAR processing pipeline comprising a complex 2D autofocus SARNet, followed by a CNN-based classification model.",
    "abstract": ""
  },
  {
    "id": "UCWater",
    "x": 0.8102,
    "y": 1.6027,
    "z": -1.5846,
    "title": "UCWater: Unsupervised Content-Adaptive Water-Body Extraction Framework for High-Resolution Satellite Imagery",
    "citations": 0,
    "doi": "10.1109/IGARSS47720.2021.9553270",
    "year": 2021,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Jiahui Yang", "Qiqi Zhu", "Jianjun Lv", "Qingfeng Guan"],
    "venue": "2021 IEEE International Geoscience and Remote Sensing Symposium IGARSS",
    "tldr": "In this paper, an unsupervised content-adaptive water-body extraction framework (UCWater) is proposed for HRSI.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": 0.7472,
    "y": 1.4415,
    "z": -1.7535,
    "title": "An innovative traffic light recognition method using vehicular ad-hoc networks",
    "citations": 13,
    "doi": "10.1038/s41598-023-31107-8",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Esraa Al-Ezaly", "Hazem M. El-bakry", "Ahmed Abo-Elfetoh", "Sara Elhishi"],
    "venue": "Scientific Reports",
    "tldr": "Car congestion is a pressing issue for everyone on the planet.",
    "abstract": ""
  },
  {
    "id": "Layer-Sensitivity-Aware",
    "x": 0.4485,
    "y": 1.4971,
    "z": -1.3969,
    "title": "Layer-Sensitivity-Aware Hybrid Redundancy Hardening Design for Reliable CNN Accelerators",
    "citations": 0,
    "doi": "10.1109/LGRS.2026.3719316",
    "year": 2026,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Xingtong Yu", "Yu Xie", "He Chen", "Shuo Ni", "Haitao Chen", "Ning Zhang"],
    "venue": "IEEE Geoscience and Remote Sensing Letters",
    "tldr": "Convolutional neural networks (CNNs) are increasingly deployed in satellite remote sensing signal processing systems to support onboard image interpretation and low-latency intelligent processing.",
    "abstract": ""
  },
  {
    "id": "APPLICATION",
    "x": 0.8366,
    "y": 1.474,
    "z": -1.5739,
    "title": "APPLICATION OF MACHINE LEARNING FOR OBJECT DETECTION IN OBLIQUE AERIAL IMAGES",
    "citations": 2,
    "doi": "10.5194/isprs-archives-xliii-b2-2022-657-2022",
    "year": 2022,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["P. Zachar", "Z. Kurczynski", "W. Ostrowski"],
    "venue": "The International Archives of the Photogrammetry, Remote Sensing and Spatial Information Sciences",
    "tldr": "At the time of continuous development of all technologies, deep machine learning (more precisely, convolutional neural networks), which is one of the branches of artificial intelligence (AI), has found wide application in many fields, including photogrammetry and remote sensing.",
    "abstract": ""
  },
  {
    "id": "Vessel",
    "x": 0.9508,
    "y": 1.4631,
    "z": -1.4321,
    "title": "Vessel Detection using Image Processing and Neural Networks",
    "citations": 5,
    "doi": "10.1109/IGARSS39084.2020.9323883",
    "year": 2020,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["K. Bereta", "R. Grasso", "D. Zissis"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "In this paper we describe a multistage data-centric workflow that integrates satellite optical imagery and AIS data for automatic vessel detection that builds on (i) image processing techniques and (ii) Convolutional Neural networks.",
    "abstract": ""
  },
  {
    "id": "Training-free",
    "x": 0.9036,
    "y": 1.4341,
    "z": -1.3404,
    "title": "ID: 2506.04285 | Year: 2025",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Comparative",
    "x": 0.8708,
    "y": 1.646,
    "z": -1.3855,
    "title": "Comparative Analysis of Various Machine Learning Techniques for Flood Prediction",
    "citations": 9,
    "doi": "10.1109/ICITIIT54346.2022.9744177",
    "year": 2022,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Sajimon Abraham", "Jyothish V R", "Sijo Thomas", "B. Jose"],
    "venue": "2022 International Conference on Innovative Trends in Information Technology (ICITIIT)",
    "tldr": "A flood is a most destructive disaster that affects people, places, and lives.",
    "abstract": ""
  },
  {
    "id": "Improvement",
    "x": 0.7124,
    "y": 1.3647,
    "z": -1.2466,
    "title": "Improvement of Satellite Image Classification Using Attention-Based Vision Transformer",
    "citations": 6,
    "doi": "10.5220/0012298400003636",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Nawel Slimani", "Imen Jdey", "M. Kherallah"],
    "venue": "International Conference on Agents and Artificial Intelligence",
    "tldr": ": This study introduces a transformative approach to satellite image classification using the Vision Transformer (ViT) model, a revolutionary deep learning method.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.7972,
    "y": 1.4948,
    "z": -1.3711,
    "title": "ID: 1907.05283 | Year: 2019",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Classification",
    "x": 0.4588,
    "y": 1.5168,
    "z": -1.3787,
    "title": "Classification of the global Sentinel-1 SAR vignettes for ocean surface process studies",
    "citations": 60,
    "doi": "10.1016/j.rse.2019.111457",
    "year": 2019,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Chen Wang", "P. Tandeo", "A. Mouche", "J. Stopa", "Victor Gressani", "Nicolas Long\u00e9p\u00e9", "D. Vandemark", "R. Foster", "B. Chapron"],
    "venue": "Academic Conference",
    "tldr": "In this study, we propose to apply the emerging deep learning approach in ocean SAR scenes classification.",
    "abstract": ""
  },
  {
    "id": "Toward",
    "x": 0.49,
    "y": 1.5147,
    "z": -1.4468,
    "title": "Toward the recognition of spacecraft feature components: A new benchmark and a new model",
    "citations": 30,
    "doi": "10.1007/s42064-021-0103-3",
    "year": 2021,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Linwei Qiu", "Liang Tang", "R. Zhong"],
    "venue": "Astrodynamics",
    "tldr": "Considering real-world illumination conditions and imperfect camera observations, we developed a degradation algorithm that enabled us to produce thousands of artificial images of spacecraft.",
    "abstract": ""
  },
  {
    "id": "Para-YOLO",
    "x": 0.8953,
    "y": 1.2781,
    "z": -1.5276,
    "title": "Para-YOLO: An Efficient High-Parameter Low-Computation Algorithm Based on YOLO11n for Remote Sensing Object Detection",
    "citations": 4,
    "doi": "10.1109/JSTARS.2025.3576221",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Hang Chen", "Qi Cao", "Yongqiang Wang", "Shang Wang", "H. Fu", "Zhenjiao Chen", "Feng Liang"],
    "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
    "tldr": "To overcome these challenges, we propose Para-YOLO, an efficient and cost-effective algorithm consisting of a novel feature fusion network and three innovative modules.",
    "abstract": ""
  },
  {
    "id": "High-resolution",
    "x": 0.5897,
    "y": 1.5733,
    "z": -1.3794,
    "title": "ID: 2405.04483 | Year: 2024",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.8508,
    "y": 1.5747,
    "z": -1.324,
    "title": "ID: 1702.07985 | Year: 2017",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.7044,
    "y": 1.5034,
    "z": -1.6828,
    "title": "A Hybrid Preference Interaction Mechanism for Multi-Satellite Imaging Dynamic Mission Planning",
    "citations": 2,
    "doi": "10.3390/electronics13122374",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Xueying Yang", "Min Hu", "Gang Huang", "Yijun Wang"],
    "venue": "Electronics",
    "tldr": "The existing multi-satellite dynamic mission planning system hardly satisfies the requirements of fast response time and high mission benefit in highly dynamic situations.",
    "abstract": ""
  },
  {
    "id": "URBAN",
    "x": 0.8291,
    "y": 1.5972,
    "z": -1.6864,
    "title": "URBAN ENVIRONMENTAL FLOOD SUSCEPTIBILITY USING A MULTI-LAYERED NEURAL NETWORK MODEL FROM SATELLITE IMAGERY SOURCES",
    "citations": 0,
    "doi": "10.30955/gnj.005139",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Global NEST. International Journal",
    "tldr": "Recently, there has been a rise in research based on data-driven based machine learning models to address the issue of processing speed posed by various physiological simulations.",
    "abstract": ""
  },
  {
    "id": "Modality-Aware",
    "x": 0.5311,
    "y": 1.4943,
    "z": -1.3315,
    "title": "Modality-Aware Feature Integration for Pan-Sharpening",
    "citations": 14,
    "doi": "10.1109/TGRS.2022.3232384",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Man Zhou", "Jie Huang", "Fengmei Zhao", "D. Hong"],
    "venue": "IEEE Transactions on Geoscience and Remote Sensing",
    "tldr": "To address this issue, we propose a novel information compensation and integration network for pan-sharpening by effective cross-modality joint learning in this work.",
    "abstract": ""
  },
  {
    "id": "Super-Resolution",
    "x": 0.5568,
    "y": 1.5481,
    "z": -1.4742,
    "title": "Super-Resolution of Satellite Images by two-Dimensional RRDB and Edge-Enhancement Generative Adversarial Network",
    "citations": 7,
    "doi": "10.1109/icassp43922.2022.9747063",
    "year": 2022,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Yu-Zhang Chen", "Tsung-Jung Liu", "Kuan-Hsien Liu"],
    "venue": "IEEE International Conference on Acoustics, Speech, and Signal Processing",
    "tldr": "With the increasing demand for high-resolution images, image super-resolution (SR) technology has become one of the focuses in related research fields.",
    "abstract": ""
  },
  {
    "id": "Land",
    "x": 0.7064,
    "y": 1.2146,
    "z": -1.4566,
    "title": "Land Cover Analysis with Fully Convolutional Network",
    "citations": 0,
    "doi": "10.37396/jsc.v8i1.496",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Abib Raifmuaffah Ihwan", "Nouval Trezandy Lapatta", "Yuri Yudhaswana Joefrie", "Yusuf Anshori", "Syahrullah Syahrullah"],
    "venue": "Jurnal Sistem Cerdas",
    "tldr": "This study analyses land cover in Morowali Regency using Sentinel-2 satellite imagery and the Fully Convolutional Network (FCN) algorithm.",
    "abstract": ""
  },
  {
    "id": "Remote",
    "x": 0.9685,
    "y": 1.4328,
    "z": -1.6426,
    "title": "Remote Sensing Based Land Cover Classification Using Machine Learning and Deep Learning: A Comprehensive Survey",
    "citations": 2,
    "doi": "10.47164/ijngc.v14i2.1137",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Soma Mitra", "Dr. Saikat Basu"],
    "venue": "International Journal of Next-Generation Computing",
    "tldr": "Since the 1990s, remote sensing images have been used for land cover classification combined with MachineLearning algorithms.",
    "abstract": ""
  },
  {
    "id": "Deep",
    "x": 0.6189,
    "y": 1.242,
    "z": -1.302,
    "title": "Deep learning for weak signal acquisition: correlation peak pixel absolute position using deep CNNs",
    "citations": 2,
    "doi": "10.1109/icspcc52875.2021.9564619",
    "year": 2021,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Bo Lu", "Wenjing Chen", "Chen Qu"],
    "venue": "International Conference on Signal Processing, Communications and Computing",
    "tldr": "In a fading environment, satellite navigation signal is so weak that a receiver hardly has a high detection probability using traditional acquisition algorithm.",
    "abstract": ""
  },
  {
    "id": "Multilevel",
    "x": 0.9947,
    "y": 1.6309,
    "z": -1.2894,
    "title": "Multilevel Semantic Labeling of Mobile Homes from Overhead Imagery",
    "citations": 0,
    "doi": "10.1109/IGARSS.2018.8517660",
    "year": 2018,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["D. Lunga", "M. Seals", "B. Bhaduri"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "Finding where people live and the vulnerabilities of manmade facilities during natural disasters is not only critical for rescue efforts but also essential for damage assessment in the aftermath.",
    "abstract": ""
  },
  {
    "id": "Compressive",
    "x": 0.6429,
    "y": 1.4869,
    "z": -1.3247,
    "title": "Compressive Sensing Based Reconstruction and Pixel-Level Classification of Very High-Resolution Disaster Satellite Imagery Using Deep Learning",
    "citations": 5,
    "doi": "10.1109/IGARSS.2019.8899871",
    "year": 2019,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Rajat C. Shinde", "Abhishek V. Potnis", "S. Durbha", "Prakash Andugula"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "In this work, we propose a two-fold analysis of the Very High Resolution (VHR) satellite imagery based on Compressive Sensing (CS) and Deep Learning.",
    "abstract": ""
  },
  {
    "id": "Enhancing",
    "x": 0.8913,
    "y": 1.5724,
    "z": -1.6748,
    "title": "Enhancing Remote Sensing Image Scene Classification With Satellite-Terrestrial Collaboration and Attention-Aware Transmission Policy",
    "citations": 2,
    "doi": "10.1109/TMC.2025.3526142",
    "year": 2025,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Anqi Lu", "Youbing Hu", "Zhiqiang Cao", "Jie Liu", "Lingzhi Li", "Zhijun Li"],
    "venue": "IEEE Transactions on Mobile Computing",
    "tldr": "To address this, we propose a novel Satellite-Terrestrial Collaborative Scene Classification (STCSC) framework that integrates transmission and computation.",
    "abstract": ""
  },
  {
    "id": "Super-Resolution",
    "x": 0.7362,
    "y": 1.4596,
    "z": -1.3536,
    "title": "Super-Resolution Data Augmentation Method on 2D Segmentation of 3D Point Cloud Data",
    "citations": 0,
    "doi": "10.1109/ELECO64362.2024.10847095",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["M. O. \u015eerifo\u011flu", "Do\u011facan Toka", "M. Darici", "Elif G\u00fcm\u00fc\u015fl\u00fc"],
    "venue": "International Conference on Electrical and Electronics Engineering",
    "tldr": "3D deep learning methods are widely used in point cloud semantic segmentation.",
    "abstract": ""
  },
  {
    "id": "Big",
    "x": 0.7161,
    "y": 1.3372,
    "z": -1.4957,
    "title": "Big Earths of China: Remotely Sensing Xinjiang along the Belt and Road",
    "citations": 4,
    "doi": "10.1086/721173",
    "year": 2022,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Shaoling Ma"],
    "venue": "Critical Inquiry",
    "tldr": "Undergirding China’s Belt and Road Initiative’s lofty promise of global connectivity are existing connections between the PRC’s implementation of planetary-scale observation systems for environmental sustainability and the recognizably nefarious policies of localized, colonial surveillance of Turkic minorities in the Xinjiang Uyghur Autonomous Region (XUAR).",
    "abstract": ""
  },
  {
    "id": "Learning",
    "x": 0.7457,
    "y": 1.404,
    "z": -1.5265,
    "title": "Learning point process models for vehicles detection using CNNs in satellite images",
    "citations": 1,
    "doi": "10.1109/SITIS61268.2023.00022",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Jules Mabon", "M. Ortner", "J. Zerubia"],
    "venue": "International Conference on Signal-Image Technology and Internet-Based Systems",
    "tldr": "We present a method combining marked point processes and convolutional neural networks applied to the detection of small objects in optical satellite images.",
    "abstract": ""
  },
  {
    "id": "Deep",
    "x": 0.9101,
    "y": 1.6513,
    "z": -1.4891,
    "title": "Deep Reinforcement Learning Based Interference Avoidance Beam-Hopping Allocation Algorithm in Multi-beam Satellite Systems",
    "citations": 7,
    "doi": "10.1109/TrustCom60117.2023.00268",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Haonan Wang", "Lixiang Liu", "Xin Zhou", "Lexi Xu", "Guangyang Wu", "Shuaijun Liu"],
    "venue": "International Conference on Trust, Security and Privacy in Computing and Communications",
    "tldr": "To address this issue, we propose a deep reinforcement learning based interference avoidance beam-hopping allocation algorithm(DRL-IABHA).",
    "abstract": ""
  },
  {
    "id": "Local",
    "x": 0.8249,
    "y": 1.6009,
    "z": -1.2436,
    "title": "Local PM2.5 Hotspot Detector at 300 m Resolution: A Random Forest-Convolutional Neural Network Joint Model Jointly Trained on Satellite Images and Meteorology",
    "citations": 18,
    "doi": "10.3390/rs13071356",
    "year": 2021,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Tongshu Zheng", "M. Bergin", "Guoyin Wang", "David E. Carlson"],
    "venue": "Remote Sensing",
    "tldr": "Satellite-based rapid sweeping screening of localized PM2.5 hotspots at fine-scale local neighborhood levels is highly desirable.",
    "abstract": ""
  },
  {
    "id": "Storm",
    "x": 0.5317,
    "y": 1.3749,
    "z": -1.5315,
    "title": "Storm and Disaster Risk Prediction in Coastal Areas",
    "citations": 0,
    "doi": "10.1109/AIAC63745.2024.10899543",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Chaoyang Wang", "Jinfang Hou", "Qiushi Li", "Shengbo Xu", "Zhichao Dong"],
    "venue": "2024 2nd International Conference on Artificial Intelligence and Automation Control (AIAC)",
    "tldr": "This paper addresses the critical issue of storm and disaster risk prediction in coastal regions.",
    "abstract": ""
  },
  {
    "id": "Large-scale",
    "x": 0.6103,
    "y": 1.3791,
    "z": -1.4847,
    "title": "ID: 2403.12226 | Year: 2024",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Discovery",
    "x": 0.9776,
    "y": 1.5996,
    "z": -1.2679,
    "title": "Discovery of astronomical objects in galaxies by means of deep learning",
    "citations": 2,
    "doi": "10.1051/matecconf/202439201123",
    "year": 2024,
    "clusterId": 1,
    "color": "#E41A1C",
    "size": 0.2,
    "authors": ["Ponguvala Haindavi", "Sunil Kumar", "Ganesh", "R. A. Kumar", "Gaurav Pushkarna"],
    "venue": "MATEC Web of Conferences",
    "tldr": "The study of space exploration has been studied for a very long time, and as technology has developed, so too have the methods and techniques employed, along with the quantity and type of data acquired.",
    "abstract": ""
  },
  {
    "id": "B.SAR",
    "x": -0.468,
    "y": -0.9656,
    "z": 0.891,
    "title": "ID: 1805.06343 | Year: 2018",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Repeat-pass",
    "x": -0.5507,
    "y": -0.8141,
    "z": 1.1644,
    "title": "Repeat-pass SAR Interferometry Experiments with Gaofen-3: A Case Study of Ningbo and Nanjing Area",
    "citations": 5,
    "doi": "10.1109/EORSA.2018.8598621",
    "year": 2018,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Tao Zhang", "Xiaolei Lv", "Bing Han", "Bin Lei", "L. Wan", "Jun Hong"],
    "venue": "International Workshop on Earth Observation and Remote Sensing Applications",
    "tldr": "By using the latest SAR interferogram filter and phase unwrapping method we proposed, we improved the coherence up to 0.8 in urban area.",
    "abstract": ""
  },
  {
    "id": "Hydrological",
    "x": -0.5826,
    "y": -0.8763,
    "z": 0.669,
    "title": "Hydrological instability and archaeological impact in Northwest Greenland: Sudden mass movement events signal new concerns for circumpolar archaeology",
    "citations": 15,
    "doi": "10.1016/J.QUASCIREV.2020.106600",
    "year": 2020,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Matthew Walls", "Madisen Hvidberg", "Mari Kleist", "Pauline Knudsen", "Pivinnguaq M\u00f8rch", "Pia Egede", "G. Taylor", "Niki Phillips", "S. Yamasaki", "Tatsuya Watanabe"],
    "venue": "Academic Conference",
    "tldr": "In this paper, we consider implication for circumpolar archaeology, and focus analysis on a study area of critical importance to the local Inughuit community at Siorapaluk – a small settlement in Northwest Greenland.",
    "abstract": ""
  },
  {
    "id": "Seismic",
    "x": -0.5324,
    "y": -0.7844,
    "z": 0.8298,
    "title": "Seismic multi-hazard and impact estimation via causal inference from satellite imagery",
    "citations": 59,
    "doi": "10.1038/s41467-022-35418-8",
    "year": 2022,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Susu Xu", "Joshua Dimasaka", "D. Wald", "H. Noh"],
    "venue": "Nature Communications",
    "tldr": "Herein, we present a rapid seismic multi-hazard and impact estimation system that leverages advanced statistical causal inference and remote sensing techniques.",
    "abstract": ""
  },
  {
    "id": "Early",
    "x": -0.571,
    "y": -0.8657,
    "z": 1.1554,
    "title": "Early and persistent supershear rupture of the 2018 magnitude 7.5 Palu earthquake",
    "citations": 238,
    "doi": "10.1038/s41561-018-0297-z",
    "year": 2019,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["H. Bao", "J. Ampuero", "L. Meng", "E. Fielding", "C. Liang", "C. Milliner", "T. Feng", "Hui Huang"],
    "venue": "Nature Geoscience",
    "tldr": "Here we present robust evidence of an early and persistent supershear rupture at the sub-Eshelby speed of the 2018 magnitude 7.5 Palu, Indonesia, earthquake.",
    "abstract": ""
  },
  {
    "id": "Pre-eruption",
    "x": -0.9048,
    "y": -1.091,
    "z": 1.0855,
    "title": "Pre-eruption Deformation Prior to 2018 Eruption of Anak Krakatau Volcano",
    "citations": 0,
    "doi": "10.1088/1755-1315/1418/1/012026",
    "year": 2024,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["R. F. Adiwijaya", "T. P. Sidiq", "E. Kriswati"],
    "venue": "IOP Conference Series: Earth and Environment",
    "tldr": "Anak Krakatau is an active volcano situtated in Sunda Strait between Sumatera and Java that is frequently erupts.",
    "abstract": ""
  },
  {
    "id": "Two",
    "x": -0.5105,
    "y": -1.0402,
    "z": 0.9649,
    "title": "Two multi-temporal datasets to track debris flow after the 2008 Wenchuan earthquake",
    "citations": 0,
    "doi": "10.1038/s41597-022-01658-y",
    "year": 2022,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Lei Wang", "Ming-Yao Chang", "Jian Le", "Lanlan Xiang", "Zhang Ni"],
    "venue": "Scientific Data",
    "tldr": "We provide two datasets for tracking the debris flow induced by the 2008 Wenchuan Mw 7.9 earthquake on a section of the Longmen mountains on the eastern side of the Tibetan plateau (Sichuan, China).",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.8086,
    "y": -1.0784,
    "z": 0.9143,
    "title": "A Cross-Modal Multi-Attitude Framework for the Generation of Space Target ISAR Images",
    "citations": 3,
    "doi": "10.1109/ICASSP49660.2025.10888516",
    "year": 2025,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Derong Kong", "Huaizhang Liao", "Jingyuan Xia"],
    "venue": "IEEE International Conference on Acoustics, Speech, and Signal Processing",
    "tldr": "This paper introduces an innovative optical-to-radar cross-modal framework for the generation of full-attitude, high-fidelity space target ISAR samples, denominated as AORC.",
    "abstract": ""
  },
  {
    "id": "Fine-Resolution",
    "x": -0.8256,
    "y": -0.9481,
    "z": 1.0738,
    "title": "Fine-Resolution Mapping of Pan-Arctic Lake Ice-Off Phenology Based on Dense Sentinel-2 Time Series Data",
    "citations": 10,
    "doi": "10.3390/rs13142742",
    "year": 2021,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Chong Liu", "Huabing Huang", "Fengming Hui", "Ziqian Zhang", "Xiao Cheng"],
    "venue": "Remote Sensing",
    "tldr": "To fill this knowledge gap, we developed a new approach for fine-resolution mapping of Pan-Arctic lake ice-off phenology.",
    "abstract": ""
  },
  {
    "id": "AUTOMATIC",
    "x": -0.5995,
    "y": -0.8787,
    "z": 0.6865,
    "title": "AUTOMATIC CALCULATION OF OIL SLICK AREA FROM MULTIPLE SAR ACQUISITIONS FOR DEEPWATER HORIZON OIL SPILL",
    "citations": 1,
    "doi": "10.5194/ISPRSARCHIVES-XXXIX-B7-63-2012",
    "year": 2012,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["B. Osmano\u011flu", "Coskun Ozkan", "F. Sunar", "G. Staples"],
    "venue": "Academic Conference",
    "tldr": "We developed a new algorithm for determining the extent of the oil spill from multiple SAR images, that are acquired with short temporal intervals using different sensors.",
    "abstract": ""
  },
  {
    "id": "SBAS-InSAR",
    "x": -0.8938,
    "y": -0.8314,
    "z": 0.827,
    "title": "SBAS-InSAR analysis for deformation monitoring in landslide-prone areas: A case study of Murang’a and Nyeri Counties in Kenya",
    "citations": 0,
    "doi": "10.55779/ng53423",
    "year": 2025,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Alex M. Yumbu", "P. Odera"],
    "venue": "Nova Geodesia",
    "tldr": "Mass movement events impact thousands globally, causing loss of life, displacement of people and destruction of farmland and infrastructure, among other devastating impacts.",
    "abstract": ""
  },
  {
    "id": "Tracking",
    "x": -0.8008,
    "y": -0.9972,
    "z": 1.047,
    "title": "Tracking morphological changes and slope instability using spaceborne and ground-based SAR data",
    "citations": 68,
    "doi": "10.1016/J.GEOMORPH.2017.10.023",
    "year": 2018,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["F. Di Traglia", "T. Nolesini", "A. Ciampalini", "L. Solari", "William Frodella", "F. Bellotti", "A. Fumagalli", "G. De Rosa", "N. Casagli"],
    "venue": "Academic Conference",
    "tldr": "Abstract Stromboli (Aeolian Archipelago, Italy) is an active volcano that is frequently affected by moderate to large mass wasting, which has occasionally triggered tsunamis.",
    "abstract": ""
  },
  {
    "id": "SNOW",
    "x": -0.4731,
    "y": -0.796,
    "z": 1.1311,
    "title": "SNOW COVER MAPPING AND ICE AVALANCHE MONITORING FROM THE SATELLITE DATA OF THE SENTINELS",
    "citations": 9,
    "doi": "10.5194/ISPRS-ARCHIVES-XLII-3-1765-2018",
    "year": 2018,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Sisi Wang", "Baolin Yang", "Yueliang Zhou", "Futao Wang", "R. Zhang", "Qin\u2010Shi Zhao"],
    "venue": "Academic Conference",
    "tldr": "In order to monitor ice avalanches efficiently under disaster emergency conditions, a snow cover mapping method based on the satellite data of the Sentinels is proposed, in which the coherence and backscattering coefficient image of Synthetic Aperture Radar (SAR) data (Sentinel-1) is combined with the atmospheric correction result of multispectral data (Sentinel-2).",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.6312,
    "y": -1.1177,
    "z": 1.0524,
    "title": "A Procedure for the Quantitative Comparison of Rainfall and DInSAR-Based Surface Displacement Time Series in Slow-Moving Landslides: A Case Study in Southern Italy",
    "citations": 4,
    "doi": "10.3390/rs15020320",
    "year": 2023,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["F. Ardizzone", "S. L. Gariano", "E. Volpe", "L. Antronico", "R. Coscarelli", "M. Manunta", "A. Mondini"],
    "venue": "Remote Sensing",
    "tldr": "Earth observation data are useful to analyze the impact of climate-related variables on geomorphological processes.",
    "abstract": ""
  },
  {
    "id": "Analyzing",
    "x": -0.8919,
    "y": -0.9418,
    "z": 0.9355,
    "title": "Analyzing short term spatial and temporal dynamics of water presence at a basin-scale in Mexico using SAR data",
    "citations": 9,
    "doi": "10.1080/15481603.2020.1840106",
    "year": 2020,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["A. L\u00f3pez-Caloca", "F. Omar Tapia-Silva", "F. L\u00f3pez", "Henao Pilar", "A. O. Ram\u00edrez Gonz\u00e1lez", "Guadalupe Rivera"],
    "venue": "Academic Conference",
    "tldr": "ABSTRACT The dynamic nature of continental water body covers is a main indicator of the status of this ecological capital and its trends on the land surface.",
    "abstract": ""
  },
  {
    "id": "Time-series",
    "x": -0.7332,
    "y": -0.9748,
    "z": 1.0994,
    "title": "Time-series snowmelt detection over the Antarctic using Sentinel-1 SAR images on Google Earth Engine",
    "citations": 67,
    "doi": "10.1016/J.RSE.2021.112318",
    "year": 2021,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Dong Liang", "Huadong Guo", "Lu Zhang", "Yun Cheng", "Qi Zhu", "Xu-Ting Liu"],
    "venue": "Academic Conference",
    "tldr": "Abstract The Antarctic ice sheet is an important mass of glacier ice.",
    "abstract": ""
  },
  {
    "id": "Tracing",
    "x": -0.4621,
    "y": -0.8578,
    "z": 1.077,
    "title": "Tracing sulphur dioxide in volcanic deposits and ash emission during the 2019 Sinabung eruptions",
    "citations": 2,
    "doi": "10.1088/1755-1315/1306/1/012020",
    "year": 2024,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["D. Fiantis", "H. Zulhakim", "N. Yulanda", "F. I. Ginting", "Gusnidar", "S. Yasin"],
    "venue": "IOP Conference Series: Earth and Environment",
    "tldr": "Sulphur dioxide (SO2) emissions from Mt.",
    "abstract": ""
  },
  {
    "id": "Design",
    "x": -0.7751,
    "y": -1.1565,
    "z": 1.0238,
    "title": "Design and implementation of spaceborne SAR radio frequency interference detection and suppression system",
    "citations": 1,
    "doi": "10.1117/12.3010412",
    "year": 2023,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Xingwang Hu", "Hengrui Zhang", "Ning Li", "Zhengwei Guo"],
    "venue": "International Conference on Remote Sensing, Mapping, and Geographic Systems",
    "tldr": "Spaceborne synthetic aperture radar (SAR) is an active radar system carried on a satellite, with the help of synthetic aperture technology to achieve all-day, all-weather, high-resolution imaging, it has been widely used in military reconnaissance, resource exploration, deep space exploration and other fields.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.509,
    "y": -0.7395,
    "z": 1.1097,
    "title": "A method of tropospheric signal delay correction іn satellite sar observations",
    "citations": 0,
    "doi": "10.33841/1819-1339-2-48-41-48",
    "year": 2024,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["D. Kukhtar"],
    "venue": "Modern achievements of geodesic science and industry",
    "tldr": "The purpose of this work is to calculate the tropospheric signal delay using phase-based analysis for the long-term SAR observations without the involvement of auxiliary data.",
    "abstract": ""
  },
  {
    "id": "Geophysical",
    "x": -0.5736,
    "y": -0.921,
    "z": 0.7316,
    "title": "Geophysical surveys and satellite imaging for the evaluation of near‐surface terrain dynamic ‐ a case study on Grand Portage, MN, USA",
    "citations": 0,
    "doi": "10.1002/nsg.12267",
    "year": 2023,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Jeong-Mo Lee", "D. Fratta"],
    "venue": "Near Surface Geophysics",
    "tldr": "Flooding, erosion, and increases in the water level in Lake Superior have contributed to changes in the stem location and width of the Grand Portage Creek.",
    "abstract": ""
  },
  {
    "id": "Domino-style",
    "x": -0.3603,
    "y": -0.8071,
    "z": 0.8829,
    "title": "Domino-style earthquakes along blind normal faults in Northern Thessaly (Greece): kinematic evidence from field observations, seismology, SAR interferometry and GNSS",
    "citations": 29,
    "doi": "10.12681/BGSG.27102",
    "year": 2021,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["A. Ganas", "S. Valkaniotis", "P. Briole", "A. Serpetsidaki", "V. Kapetanidis", "Ilektra Karasante", "I. Kassaras", "G. Papathanassiou", "I. Karamitros", "V. Tsironi", "P. Elias", "V. Sarhosis", "A. Karakonstantis", "Emmanouela Konstantakopoulou", "P. Papadimitriou", "E. Sokos"],
    "venue": "Bulletin of the Geological Society of Greece",
    "tldr": "Here we present a joint analysis of the geodetic, seismological and geological data of the March 2021 Northern Thessaly seismic sequence, that were gathered and processed as of April 30, 2021.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": -0.7337,
    "y": -1.0544,
    "z": 0.961,
    "title": "An assessment of the spatial extent of polar dust using satellite thermal data",
    "citations": 5,
    "doi": "10.1038/s41598-020-79825-7",
    "year": 2021,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["M. Bowen", "R. Vincent"],
    "venue": "Scientific Reports",
    "tldr": "The effect of mineral dust aerosols and subsequent deposition in polar regions has historically been underestimated in climate models.",
    "abstract": ""
  },
  {
    "id": "Distributed",
    "x": -0.8627,
    "y": -0.826,
    "z": 0.9988,
    "title": "Distributed SAR Interferometry for Digital Elevation Model Generation Using Microsatellites: Processing and Demonstration",
    "citations": 1,
    "doi": "10.1109/TGRS.2026.3657152",
    "year": 2026,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Maxwell Nogueira Peixoto", "Gerhard Krieger", "Alberto Moreira", "Christian Waldschmidt", "Michelangelo Villano"],
    "venue": "IEEE Transactions on Geoscience and Remote Sensing",
    "tldr": "This work presents for the first time a concept of distributed SAR interferometry for single-pass DEM generation based on a cluster of small-aperture microsatellites, separated in both the along- and across-track directions and operating well below the Nyquist sampling frequency.",
    "abstract": ""
  },
  {
    "id": "Qualitative",
    "x": -0.9126,
    "y": -1.0302,
    "z": 0.9431,
    "title": "Qualitative Relationship of Seismic Activity with Vertical Displacements of Terrain After Mine Closure with the Use of Dinsar Technology",
    "citations": 1,
    "doi": "10.4467/21995923gp.22.006.17084",
    "year": 2022,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["P. Sopata", "Violetta Soko\u0142a-Szewio\u0142a"],
    "venue": "Geoinformatica Polonica",
    "tldr": "The liquidation process of mines is very complex and long.",
    "abstract": ""
  },
  {
    "id": "Remote",
    "x": -0.4821,
    "y": -0.8915,
    "z": 0.7656,
    "title": "Remote Sensing and Modeling of the Cryosphere in High Mountain Asia: A Multidisciplinary Review",
    "citations": 32,
    "doi": "10.3390/rs16101709",
    "year": 2024,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Qing-Hua Ye", "Yu-zhe Wang", "Lin Liu", "Linan Guo", "Xueqi Zhang", "L. Dai", "Limin Zhai", "Yafan Hu", "N. Ali", "Xinhui Ji", "Youhua Ran", "Yubao Qiu", "Lijuan Shi", "Tao Che", "Ninglian Wang", "Xin Li", "Liping Zhu"],
    "venue": "Remote Sensing",
    "tldr": "Over the past decades, the cryosphere has changed significantly in High Mountain Asia (HMA), leading to multiple natural hazards such as rock–ice avalanches, glacier collapse, debris flows, landslides, and glacial lake outburst floods (GLOFs).",
    "abstract": ""
  },
  {
    "id": "Ground",
    "x": -0.6375,
    "y": -0.9536,
    "z": 0.6208,
    "title": "Ground Stability Monitoring of Undermined and Landslide Prone Areas by Means of Sentinel-1 Multi-Temporal InSAR, Case Study from Slovakia",
    "citations": 42,
    "doi": "10.3390/GEOSCIENCES7030087",
    "year": 2017,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["R. Czikhardt", "J. Pap\u010do", "M. Bako\u0148", "P. Liscak", "P. Ondrejka", "Mari\u00e1n Zlocha"],
    "venue": "Academic Conference",
    "tldr": "Multi-temporal synthetic aperture radar interferometry techniques (MT-InSAR) are nowadays a well-developed remote sensing tool for ground stability monitoring of areas afflicted by natural hazards.",
    "abstract": ""
  },
  {
    "id": "ICINGS",
    "x": -0.8279,
    "y": -0.8898,
    "z": 0.7815,
    "title": "ICINGS IN THE PROJECT AREA OF THE POWER OF SIBERIA-2 GAS PIPELINE IN THE REPUBLIC OF BURYATIA",
    "citations": 0,
    "doi": "10.7868/s3034640125010022",
    "year": 2025,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Vladimir Chernykh"],
    "venue": "Геоэкология. Инженерная геология. Гидрогеология. Геокриология / Environmental Geoscience",
    "tldr": "The objective of this study is to evaluate the extent of icings formation along the proposed gas pipeline route within the Republic of Buryatia, including the identification of the areas of their formation, genesis, spatial and temporal dynamics, and potential negative impact on engineering structures.",
    "abstract": ""
  },
  {
    "id": "Integration",
    "x": -0.5664,
    "y": -0.8475,
    "z": 0.6318,
    "title": "Integration of Satellite Data Analysis with Ground Penetrating Radar to Map Archaeological Features in Al Aamerah, United Arab Emirates",
    "citations": 0,
    "doi": "10.1109/IWAGPR65621.2025.11109039",
    "year": 2025,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["S\u00f3nia Santos-Assun\u00e7\u00e3o", "Diana Francis", "Moamen Ali", "Cherif Charfeddine", "Mohammed Y. Ali", "M. A. Iqbal"],
    "venue": "International Workshop on Advanced Ground Penetrating Radar",
    "tldr": "Traditional techniques of locating past settlements through visual inspection and excavation can be time-consuming and insufficient.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.3877,
    "y": -1.1279,
    "z": 0.9043,
    "title": "A Novel Imaging Scheme of Squint Multichannel SAR: First Result of GF-3 Satellite",
    "citations": 2,
    "doi": "10.3390/rs14163962",
    "year": 2022,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Yini Lv", "M. Shang", "L. Zhong", "Xiaolan Qiu", "C. Ding"],
    "venue": "Remote Sensing",
    "tldr": "The azimuth multichannel synthetic aperture radar (MC-SAR) is an effective means of earth observation due to its high-resolution and wide-swath (HRWS) imaging capability.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.5244,
    "y": -0.9888,
    "z": 0.9659,
    "title": "A Gaussian Process Regression Approach for Fusion of Remote Sensing Images for Oil Spill Segmentation",
    "citations": 4,
    "doi": "10.23919/ICIF.2018.8455304",
    "year": 2018,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["F. Longman", "L. Mihaylova", "Le Yang"],
    "venue": "Fusion",
    "tldr": "This paper presents a framework using Gaussian process (GP) to fuse SAR images of different modalities and to segment dark areas (assumed oil spill) for oil spill detection.",
    "abstract": ""
  },
  {
    "id": "IEEE",
    "x": -0.671,
    "y": -0.9048,
    "z": 0.901,
    "title": "IEEE Transactions on Microwave Theory and Techniques Special Issue CFP",
    "citations": 0,
    "doi": "10.1109/mmm.2020.3020486",
    "year": 2020,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": [],
    "venue": "IEEE Microwave Magazine",
    "tldr": "Motivation The aim of this Special Issue is to publish technical papers in microwave and millimeter-wave communication and sensor systems.",
    "abstract": ""
  },
  {
    "id": "Volcanic",
    "x": -0.8347,
    "y": -0.9985,
    "z": 1.0,
    "title": "Volcanic SO2 total mass dataset on Mt. Etna (Italy) from 2018 to 2025 using sentinel-5P TROPOMI",
    "citations": 0,
    "doi": "10.1016/j.dib.2026.112876",
    "year": 2026,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["M. Dozzo", "A. Aiuppa", "G. Bilotta", "A. Cappello", "G. Ganci"],
    "venue": "Data in Brief",
    "tldr": "Sulfur dioxide (SO₂) is released by the magma degassing in the shallow crust, constituting a key indicator of magma ascent rates in the feeding conduit, as well as providing information on the style and the intensity of eruptive activity.",
    "abstract": ""
  },
  {
    "id": "Simulation",
    "x": -0.5157,
    "y": -0.8966,
    "z": 1.0865,
    "title": "Simulation of SEVIRI infrared channels: a case study from the Eyjafjallajökull April/May 2010 eruption",
    "citations": 12,
    "doi": "10.5194/AMT-6-649-2013",
    "year": 2012,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["A. Kylling", "R. Buras", "S. Eckhardt", "C. Emde", "Bernhard Mayer", "A. Stohl"],
    "venue": "Academic Conference",
    "tldr": "Infrared satellite images are widely and successfully used to detect and follow atmospheric ash from erupting volcanoes.",
    "abstract": ""
  },
  {
    "id": "Application",
    "x": -0.9048,
    "y": -1.0477,
    "z": 1.0504,
    "title": "Application of InSAR satellite method for mapping of active landslides in Bulgaria – opportunities and perspectives",
    "citations": 0,
    "doi": "10.5194/ica-proc-4-10-2021",
    "year": 2021,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["M. Atanasova", "H. Nikolov", "Lyubka Pashova"],
    "venue": "Proceedings of the ICA",
    "tldr": "In this paper, we demonstrate the applicability of Differential Sentinel-1A satellite SAR interferometry (DInSAR) to assess the movement activity and use the information for further updating the national landslide inventories in Bulgaria.",
    "abstract": ""
  },
  {
    "id": "Hydrothermal",
    "x": -0.6153,
    "y": -0.9438,
    "z": 1.0897,
    "title": "Hydrothermal alteration, fumarolic deposits and fluids from Lastarria Volcanic Complex: A multidisciplinary study",
    "citations": 35,
    "doi": "10.5027/ANDGEOV43N2-A02",
    "year": 2016,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["F. Aguilera", "Susana Layana", "A. Rodr\u00edguez-D\u00edaz", "Crist\u00f3bal Gonz\u00e1lez", "J. Cort\u00e9s", "M. Inostroza"],
    "venue": "Academic Conference",
    "tldr": "A multidisciplinary study that includes processing of Landsat ETM+ satellite images, chemistry of gas condensed, mineralogy and chemistry of fumarolic deposits, and fluid inclusion data from native sulphur deposits, has been carried out in the Lastarria Volcanic Complex (LVC) with the objective to determine the distribution and characteristics of hydrothermal alteration zones and to establish the relations between gas chemistry and fumarolic deposits.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.6567,
    "y": -1.1345,
    "z": 0.8921,
    "title": "A Recalibration Method for Historical SAR Data Through Inter-Satellite Alignment",
    "citations": 0,
    "doi": "10.1109/ICSIDP62679.2024.10868735",
    "year": 2024,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Yu-Xin Xiao", "Yongsheng Zhou", "Lingling Ma", "Fei Ma", "Q. Yin", "Fan Zhang"],
    "venue": "2024 IEEE International Conference on Signal, Information and Data Processing (ICSIDP)",
    "tldr": "Recalibration of historical Synthetic Aperture Radar (SAR) data facilitates the adjustment of data that have not undergone radiometric calibration or have suboptimal calibration accuracy, ensuring consistency among diverse historical images.",
    "abstract": ""
  },
  {
    "id": "Coastal",
    "x": -0.8452,
    "y": -0.9359,
    "z": 0.8669,
    "title": "Coastal Zone of Sevastopol on High Resolution Satellite Images",
    "citations": 10,
    "doi": "10.22449/0233-7584-2015-6-43-60",
    "year": 2015,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["\u0412.A. Dulov", "M. Yurovskaya", "I. Kozlov"],
    "venue": "Academic Conference",
    "tldr": "Landsat-8 data with spatial resolution of 30-100 m provide the ability of regular monitoring of ocean phenomena with scale of 100-1000 m.",
    "abstract": ""
  },
  {
    "id": "Deforestation",
    "x": -0.9763,
    "y": -0.8946,
    "z": 1.0021,
    "title": "Deforestation Effects on Rainfall‐Induced Shallow Landslides: Remote Sensing and Physically‐Based Modelling",
    "citations": 40,
    "doi": "10.1029/2019WR025233",
    "year": 2019,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["P. Lehmann", "J. Ruette", "D. Or"],
    "venue": "Water Resources Research",
    "tldr": "Deforestation of steep slopes may temporarily reduce evapotranspiration and lessen root reinforcement thus potentially enhancing landslide susceptibility.",
    "abstract": ""
  },
  {
    "id": "Novel",
    "x": -0.6157,
    "y": -1.1896,
    "z": 0.8019,
    "title": "Novel Comparison of Pyrocumulonimbus Updrafts to Volcanic Eruptions and Supercell Thunderstorms Using Optical Flow Techniques",
    "citations": 2,
    "doi": "10.1029/2023JD039418",
    "year": 2024,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["T. M. McHardy", "David A Peterson", "Jason M. Apke", "S. D. Miller", "James R. Campbell", "E. Hyer"],
    "venue": "Journal of Geophysical Research - Atmospheres",
    "tldr": "Convective dynamics in a supercell thunderstorm, a volcanic eruption, and two pyrocumulonimbus (pyroCb) events are compared by computing cloud‐top divergence (CTD) with an optical flow technique called Deepflow.",
    "abstract": ""
  },
  {
    "id": "Modeling",
    "x": -0.6796,
    "y": -0.9802,
    "z": 0.9549,
    "title": "Modeling and Processing of Radar Signals for Earth Observation",
    "citations": 1,
    "doi": "10.1155/2008/463741",
    "year": 2008,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["M. Greco", "S. Watts"],
    "venue": "Academic Conference",
    "tldr": "The rapidly growing number of real aperture and synthetic aperture radars (SARs) devoted to Earth observation provides today a very broad coverage across space, time, and the electromagnetic spectrum.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -0.7064,
    "y": -1.0284,
    "z": 1.0339,
    "title": "A practical algorithm for the retrieval of floe size distribution of Arctic sea ice from high-resolution satellite Synthetic Aperture Radar imagery",
    "citations": 23,
    "doi": "10.1525/ELEMENTA.154",
    "year": 2017,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["B. Hwang", "Jinchang Ren", "Samuel McCormack", "C. Berry", "Ismail Ben Ayed", "H. Graber", "E. Aptoula"],
    "venue": "Academic Conference",
    "tldr": "In this study, we present an algorithm for summer sea ice conditions that semi-automatically produces the floe size distribution of Arctic sea ice from high-resolution satellite Synthetic Aperture Radar data.",
    "abstract": ""
  },
  {
    "id": "Analysis",
    "x": -0.53,
    "y": -0.7613,
    "z": 0.9567,
    "title": "Analysis of Denoising Techniques for Speckle Noise Removal in Synthetic Aperture Radar Images",
    "citations": 9,
    "doi": "10.1109/ICACCI.2018.8554917",
    "year": 2018,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["Hemani Parikh", "Samir B. Patel", "Vibha Patel"],
    "venue": "International Conference on Advances in Computing, Communications and Informatics",
    "tldr": "Active Synthetic Aperture Radar (SAR) sensors use their own source of illumination to sense the earth surface.",
    "abstract": ""
  },
  {
    "id": "Multiparametric",
    "x": -0.5102,
    "y": -0.7783,
    "z": 1.1333,
    "title": "Multiparametric sea state fields from synthetic aperture radar for maritime situational awareness",
    "citations": 44,
    "doi": "10.1016/j.rse.2022.113200",
    "year": 2022,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["A. Pleskachevsky", "B. Tings", "S. Wiehle", "J. Imber", "S. Jacobsen"],
    "venue": "Remote Sensing of Environment",
    "tldr": "This paper introduces a method for estimating a series of sea state parameters from satellite-borne synthetic aperture radar (SAR).",
    "abstract": ""
  },
  {
    "id": "Remote",
    "x": -0.4041,
    "y": -1.0582,
    "z": 0.8573,
    "title": "Remote Surveillance of Differential Deformation for Kazakhstan Offshore Kashagan Oilfield Using Microwave Satellite Remote Sensing",
    "citations": 0,
    "doi": "10.3390/rs15194754",
    "year": 2023,
    "clusterId": 2,
    "color": "#377EB8",
    "size": 0.2,
    "authors": ["E. Bayramov", "G. Tessari", "M. Kada", "S. Aliyeva", "M. Buchroithner"],
    "venue": "Remote Sensing",
    "tldr": "The primary objective of this study was to assess differential vertical and horizontal deformations for the offshore Kashagan oilfield located in the Northern Caspian Sea.",
    "abstract": ""
  },
  {
    "id": "Estimation",
    "x": 1.0896,
    "y": -0.6479,
    "z": 1.1694,
    "title": "Estimation of Soil Moisture Applying Modified Dubois Model to Sentinel-1; A Regional Study from Central India",
    "citations": 61,
    "doi": "10.3390/rs12142266",
    "year": 2020,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Abhilasha Singh", "K. Gaurav", "G. Meena", "Shashi Kumar"],
    "venue": "Remote Sensing",
    "tldr": "Surface soil moisture has a wide application in climate change, agronomy, water resources, and in many other domain of science and engineering.",
    "abstract": ""
  },
  {
    "id": "Flood",
    "x": 1.3037,
    "y": -0.5465,
    "z": 1.2954,
    "title": "Flood frequency characterization of the Nhecolândia region (Pantanal) based on high spatial and temporal resolution PlanetScope satellite images",
    "citations": 0,
    "doi": "10.1177/03091333251378968",
    "year": 2025,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Mariana Dias Ramos", "\u00c9. Merino", "C. Montes", "Didier Gastmans", "A. Melfi"],
    "venue": "Progress in Physical Geography: Earth and Environment",
    "tldr": "The study of aquatic systems is becoming increasingly critical due to global concerns about sustainable water resource management.",
    "abstract": ""
  },
  {
    "id": "Recent",
    "x": 1.1889,
    "y": -0.4232,
    "z": 1.3279,
    "title": "Recent wildfires in Central Chile: Detecting links between burned areas and population exposure in the wildland urban interface.",
    "citations": 66,
    "doi": "10.1016/j.scitotenv.2019.135894",
    "year": 2019,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["P. Sarricolea", "Roberto Serrano\u2010Notivoli", "Magdalena Fuentealba", "Marina Hernandez-Mora", "Francisco de la Barrera", "Pamela Smith", "Oliver Meseguer\u2010Ruiz"],
    "venue": "Science of the Total Environment",
    "tldr": "Wildfires are gaining importance in the Mediterranean regions owing to climate change and landscape changes due to the increasing closeness between urban areas and forests prone to wildfires.",
    "abstract": ""
  },
  {
    "id": "Land",
    "x": 1.2178,
    "y": -0.6976,
    "z": 1.1686,
    "title": "Land Surface Temperature Retrieval from Landsat 9 Satellite Data in the Case of Injibara Town and the Surrounding Banja District, Awi Nationality Administrative Zone, Amhara, Ethiopia",
    "citations": 6,
    "doi": "10.23917/forgeo.v39i2.6363",
    "year": 2025,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Minyichil Teshome Kassahun", "N. Workineh"],
    "venue": "Forum Geografic",
    "tldr": "Land surface temperature (LST) is crucial for various applications like agriculture, hydrology, urban planning, and climate analysis.",
    "abstract": ""
  },
  {
    "id": "High",
    "x": 1.2961,
    "y": -0.6499,
    "z": 1.2407,
    "title": "High Spatiotemporal Rugged Land Surface Temperature Downscaling over Saihanba Forest Park, China",
    "citations": 14,
    "doi": "10.3390/rs14112617",
    "year": 2022,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["X. Ouyang", "Youjun Dou", "Jinxin Yang", "Xiangshan Chen", "Jianguang Wen"],
    "venue": "Remote Sensing",
    "tldr": "Satellite-derived rugged land surface temperature (LST) is an important parameter indicating the status of the Earth’s surface energy budget and its seasonal/temporal dynamic change.",
    "abstract": ""
  },
  {
    "id": "Remote",
    "x": 1.2618,
    "y": -0.3645,
    "z": 1.3771,
    "title": "Remote sensing applications for reservoir water level monitoring, sustainable water surface management, and environmental risks in Quang Nam province, Vietnam",
    "citations": 22,
    "doi": "10.2166/WCC.2021.347",
    "year": 2021,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["D. N. Quang", "Nguyen Khanh Linh", "Ho Sy Tam", "N. Viet"],
    "venue": "Academic Conference",
    "tldr": "Monitoring surface water provides vital information in water management; however, limited data is a fundamental challenge for most developing countries, such as Vietnam.",
    "abstract": ""
  },
  {
    "id": "Pengolahan",
    "x": 1.2729,
    "y": -0.3576,
    "z": 1.4401,
    "title": "Pengolahan Geolokasi Produk Data Gas Rumah Kaca (GRK) dari Satelit Suomi NPP ATMS Dan CRIS Dengan Metode Interpolasi Radial Basis Function",
    "citations": 0,
    "doi": "10.30536/J.PJPDCD.2018.V15.A2798",
    "year": 2018,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Andy Indradjad", "Haris Suka Dyatmika", "N. Salyasari", "Liana Fibriawati", "Masnita Indriani"],
    "venue": "Jurnal Penginderaan Jauh dan Pengolahan Data Citra Digital",
    "tldr": "Geolocation processing to produce spatial greenhouse gases data products consisting of CH4, CO2 and N20 gases has been carried out systematically.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 1.251,
    "y": -0.5873,
    "z": 1.2383,
    "title": "A Climate Smart Framework for Forecasting Field-level Potential Evapotranspiration and Irrigation Requirement with Numerical Weather Predictions and Satellite Remote Sensing",
    "citations": 0,
    "doi": "10.5194/egusphere-egu2020-11756",
    "year": 2020,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["D. Tian", "Parisa Asadi", "H. Medina", "B. Ortiz", "Isaya Kesikka"],
    "venue": "Academic Conference",
    "tldr": "In this study, we develop a framework for forecasting ETc and IWR using multi-model numerical weather predictions and harmonized Landsat Sentinel-2 remote sensing product.",
    "abstract": ""
  },
  {
    "id": "MODIS",
    "x": 1.1231,
    "y": -0.3731,
    "z": 1.4862,
    "title": "MODIS aerosol optical depth retrieval based on random forest approach",
    "citations": 14,
    "doi": "10.1080/2150704X.2020.1842540",
    "year": 2020,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Tianchen Liang", "Lin Sun", "Haoxin Li"],
    "venue": "Remote Sensing Letters",
    "tldr": "ABSTRACT Despite significant improvement in Moderate Resolution Imaging Spectroradiometer (MODIS) aerosol optical depth (AOD) retrieval, high-resolution–high-accuracy AOD retrieval remains a challenging task.",
    "abstract": ""
  },
  {
    "id": "High",
    "x": 1.2728,
    "y": -0.3133,
    "z": 1.1559,
    "title": "High resolution satellite data and image segmentation produce accurate benthic substrate maps in clear waters of the great lakes",
    "citations": 2,
    "doi": "10.1007/s12518-025-00607-9",
    "year": 2025,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["James V. Marcaccio", "Jesse Gardner Costa", "S. Parker", "J. Midwood"],
    "venue": "Applied Geomatics",
    "tldr": "Benthic substrates are an important component of fish habitat and preferred substrates vary with species and life history traits.",
    "abstract": ""
  },
  {
    "id": "Unsupervised",
    "x": 0.9639,
    "y": -0.6234,
    "z": 1.4887,
    "title": "Unsupervised Sub-Pixel Water Body Mapping with Sentinel-3 OLCI Image",
    "citations": 35,
    "doi": "10.3390/RS11030327",
    "year": 2019,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Xia Wang", "F. Ling", "H. Yao", "Yaolin Liu", "Shuna Xu"],
    "venue": "Remote Sensing",
    "tldr": "In this paper, an unsupervised sub-pixel water body mapping (USWBM) method was proposed particularly for the Sentinel-3 OLCI image, and it aims to produce a finer spatial resolution (e.g., 30 m) water body map from the multispectral image.",
    "abstract": ""
  },
  {
    "id": "Crop",
    "x": 1.2728,
    "y": -0.3726,
    "z": 1.252,
    "title": "Crop Field Boundary Delineation using Historical Crop Rotation Pattern",
    "citations": 17,
    "doi": "10.1109/Agro-Geoinformatics.2019.8820240",
    "year": 2019,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Md. Shahinoor Rahman", "L. Di", "Zhiqi Yu", "E. Yu", "Junmei Tang", "Li Lin", "Chen Zhang", "Juozas Gaigalas"],
    "venue": "International Conference on Agro-Geoinformatics",
    "tldr": "GIS data layer on crop field boundary has many applications in agricultural research, ecosystem study, crop monitoring, and land management.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.9421,
    "y": -0.6448,
    "z": 1.4227,
    "title": "A Workshop on the Next-Generation Environmental Satellite Constellations",
    "citations": 0,
    "doi": "10.1175/bams-d-19-0349.1",
    "year": 2020,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["A. Rehbein", "Mart\u00edn Rugna", "M. P. Hobouchian", "Anna del Moral", "Steven J. Goodman", "Daniel T. Lindsey", "Janel R. Thomas"],
    "venue": "Bulletin of The American Meteorological Society - (BAMS)",
    "tldr": ") Online Training Resources for Environmental Satellites and the iterative 3D tools for satellite images were presented.",
    "abstract": ""
  },
  {
    "id": "Evaluating",
    "x": 1.2421,
    "y": -0.301,
    "z": 1.0892,
    "title": "Evaluating and improving simulations of diurnal variation in land surface temperature with the Community Land Model for the Tibetan Plateau",
    "citations": 11,
    "doi": "10.7717/peerj.11040",
    "year": 2021,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Xiaogang Ma", "Jiming Jin", "Lingjing Zhu", "Jian Liu"],
    "venue": "PeerJ",
    "tldr": "This study evaluated and improved the ability of the Community Land Model version 5.0 (CLM5.0) in simulating the diurnal land surface temperature (LST) cycle for the whole Tibetan Plateau (TP) by comparing it with Moderate Resolution Imaging Spectroradiometer satellite observations.",
    "abstract": ""
  },
  {
    "id": "Comparison",
    "x": 1.058,
    "y": -0.4692,
    "z": 1.4594,
    "title": "Comparison of Inversion Methods for Maize Canopy Time-Series LAI Based on SupReME Reconstructed Images",
    "citations": 0,
    "doi": "10.13031/ja.15011",
    "year": 2022,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Yan Li", "Jin Huang", "Wanlin Gao", "Jinglei Jia", "Sha Tao", "Yan-zhao Ren", "Xin Liu"],
    "venue": "Journal of the ASABE",
    "tldr": "Highlights          The Sentinel-2 images are reconstructed by the SupReME algorithm to obtain rich spatial features and consistent spectral reflectance.",
    "abstract": ""
  },
  {
    "id": "Prisma",
    "x": 0.9685,
    "y": -0.6807,
    "z": 1.4566,
    "title": "Prisma Products and Applications for Aquatic Ecosystems",
    "citations": 2,
    "doi": "10.1109/IGARSS53475.2024.10641559",
    "year": 2024,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["C. Giardino", "M. Bresciani", "Alice Fabbretto", "A. Pellegrino", "Lodovica Panizza", "Erica Matta", "Federica Braga", "G. Scarpa", "V. Brando"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "The monitoring of water biophysical parameters and the management of aquatic ecosystems are crucial to address the current state of degradation of inland and coastal waters.",
    "abstract": ""
  },
  {
    "id": "How",
    "x": 0.8389,
    "y": -0.4605,
    "z": 1.3759,
    "title": "How does precipitation data influence the land surface data assimilation for drought monitoring?",
    "citations": 32,
    "doi": "10.1016/j.scitotenv.2022.154916",
    "year": 2022,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["K. Gavahi", "P. Abbaszadeh", "H. Moradkhani"],
    "venue": "Science of the Total Environment",
    "tldr": "Unlike other studies that attempted the individual assimilation of these variables, here we propose a multivariate data assimilation framework.",
    "abstract": ""
  },
  {
    "id": "Discrimination",
    "x": 1.0259,
    "y": -0.5911,
    "z": 1.1944,
    "title": "Discrimination of Larch Needle Pest Severity Based on Sentinel-2 Super-Resolution and Spectral Derivatives—A Case Study of Erannis jacobsoni Djak",
    "citations": 5,
    "doi": "10.3390/f16010088",
    "year": 2025,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Guangyou Sun", "Xiaojun Huang", "Ganbat Dashzebeg", "Mungunkhuyag Ariunaa", "Yuhai Bao", "Gang Bao", "Siqin Tong", "Altanchimeg Dorjsuren", "Enkhnasan Davaadorj"],
    "venue": "Forests",
    "tldr": "In recent years, Jas’s Larch Inchworm (Erannis jacobsoni Djak, EJD) outbreaks have frequently occurred in forested areas of Mongolia, causing significant damage to forest ecosystems, and rapid and effective monitoring methods are urgently needed.",
    "abstract": ""
  },
  {
    "id": "SIMULATION",
    "x": 0.9118,
    "y": -0.4309,
    "z": 1.3264,
    "title": "SIMULATION OF MUX CAMERA IMAGES OF THE BRAZIL-CHINA SATELLITE EARTH RESOURCES (CBERS-3)",
    "citations": 1,
    "doi": "10.5194/ISPRSARCHIVES-XXXIX-B5-607-2012",
    "year": 2012,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["G. A. Boggione", "Leila Maria Garcia Fonseca", "S. Bosch-Puig", "F. Ponzoni"],
    "venue": "Academic Conference",
    "tldr": "This work presents a simulation technique for the MUX/CBERS-3.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.9695,
    "y": -0.4027,
    "z": 1.1029,
    "title": "A fusion based land cover classification model using remote sensed images",
    "citations": 5,
    "doi": "10.3233/IDT-210037",
    "year": 2022,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["M. Sahu", "Rasmita Dash"],
    "venue": "International Journal of Intelligent Decision Technologies",
    "tldr": "In this paper, a multiclass land cover classification model is proposed that comprise of pre-processing method, a multiclass classifier and performance evaluation strategy.",
    "abstract": ""
  },
  {
    "id": "Review",
    "x": 1.256,
    "y": -0.2686,
    "z": 1.1576,
    "title": "Review of remote sensing algorithms for monitoring forest disturbance from time series and multi-source data fusion",
    "citations": 17,
    "doi": "10.11834/jrs.20187089",
    "year": 2018,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Wenjuan Shen", "Mingshi Li", "Chengquan Huang"],
    "venue": "National Remote Sensing Bulletin",
    "tldr": ": Spatio-temporally explicit forest disturbance information is regarded as a critical mechanism for net ecosystem productivity.",
    "abstract": ""
  },
  {
    "id": "Study",
    "x": 1.2421,
    "y": -0.3636,
    "z": 1.4297,
    "title": "Study on Forest Fire Diffusion Method Based on Cellular Automata",
    "citations": 1,
    "doi": "10.1109/Geoinformatics60313.2023.10247973",
    "year": 2023,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Tonghe Zhang", "Qingxiang Meng", "Jinchun Liu", "Qifan Liang"],
    "venue": "GEOINFORMATICS",
    "tldr": "The results show that the over-fire area obtained by the simulation experiment is similar to the spatial distribution of the over-fire area extracted by Sentinel-2 satellite, which proves that the cellular automata model constructed in this paper has high accuracy.",
    "abstract": ""
  },
  {
    "id": "Research",
    "x": 1.2872,
    "y": -0.6333,
    "z": 1.2258,
    "title": "Research of the state of forests in the precarpathian region by satellite images using the method of supervised classification",
    "citations": 0,
    "doi": "10.33841/1819-1339-1-47-179-185",
    "year": 2024,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["YU. Petryk", "K. Burshtynska", "B. Polishchuk"],
    "venue": "Modern achievements of geodesic science and industry",
    "tldr": "The purpose of the research is to monitor the forest objects of the Rava-Ruska forestry and determine changes in their areas from 2002 to 2022.",
    "abstract": ""
  },
  {
    "id": "Google",
    "x": 1.3424,
    "y": -0.5739,
    "z": 1.2217,
    "title": "Google earth engine for spatio-temporal drought monitoring in Bangkalan, Indonesia",
    "citations": 5,
    "doi": "10.1051/bioconf/20249905006",
    "year": 2024,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Fahmi Arief Rahman", "Sinar Suryawati", "S. Supriyadi", "Basuki"],
    "venue": "BIO Web of Conferences",
    "tldr": "Drought occurrence in a certain area can be monitored by remote sensing through cloud-based platform of Google Earth Engine (GEE).",
    "abstract": ""
  },
  {
    "id": "Efficient",
    "x": 1.2224,
    "y": -0.3138,
    "z": 1.4892,
    "title": "Efficient Data Collection with an Automated Robotic Helicopter Using Bayesian Adaptive Sampling Algorithms for Control",
    "citations": 1,
    "doi": "10.5772/5821",
    "year": 2008,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["S. Crunk", "Marian Farah"],
    "venue": "Academic Conference",
    "tldr": "We propose a novel data collection technique, called Bayesian Adaptive Sampling (BAS), which enables us to capture maximum information from minimal sample size.",
    "abstract": ""
  },
  {
    "id": "Evaluating",
    "x": 1.2767,
    "y": -0.2881,
    "z": 1.4138,
    "title": "Evaluating MODIS vegetation products using digital images for quantifying local peatland CO2 gas fluxes",
    "citations": 17,
    "doi": "10.1002/rse2.45",
    "year": 2017,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["N. Gatis", "K. Anderson", "E. Grand\u2010Clement", "D. Luscombe", "I. Hartley", "David R. Smith", "R. Brazier"],
    "venue": "Academic Conference",
    "tldr": "In peatlands plant growth and senescence affect annual ecosystem carbon dioxide (CO2) exchange, and CO2 fluxes show considerable inter‐annual variability.",
    "abstract": ""
  },
  {
    "id": "Spatial",
    "x": 0.9041,
    "y": -0.4765,
    "z": 1.3376,
    "title": "Spatial Data Processing Tools and Applications for Black Sea catchment Region",
    "citations": 5,
    "doi": "10.47839/ijc.11.4.575",
    "year": 2012,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["D. Gorgan", "V. B\u00e2cu", "D. Mihon", "D. Rodila", "T. Stefanut", "K. Abbaspour", "P. Cau", "G. Giuliani", "Nicolas Ray", "A. Lehmann"],
    "venue": "Int. J. Comput.",
    "tldr": "The enviroGRIDS project has developed and provides through the BSC-OS portal a set of tools, applications and platforms concerning with the processing of huge spatial data for the Black Sea catchment region.",
    "abstract": ""
  },
  {
    "id": "ANALISIS",
    "x": 1.1965,
    "y": -0.6584,
    "z": 1.2211,
    "title": "ANALISIS KONDISI HUTAN MANGROVE DAN POTENSI SERAPAN KARBON MENGGUNAKAN DATA SENTINEL-2 DI KABUPATEN PESAWARAN",
    "citations": 1,
    "doi": "10.20527/jht.v12i3.20553",
    "year": 2024,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Alfian Zamsami Adirama", "Rizki Dimas Permana", "Achmad Chalid Afif Alfajrin", "Mohamad Ashari Dwiputra", "Nanda Widiya", "Sakti Vincensius Sozanolo Dakhi", "Weni Fira Destina"],
    "venue": "Jurnal Hutan Tropis",
    "tldr": "Climate change and global warming continue to occur up to the present.",
    "abstract": ""
  },
  {
    "id": "Satellite",
    "x": 1.2513,
    "y": -0.2577,
    "z": 1.2907,
    "title": "Satellite imagery for high-throughput phenotyping in breeding plots",
    "citations": 30,
    "doi": "10.3389/fpls.2023.1114670",
    "year": 2023,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Francisco Pinto", "M. Zaman-Allah", "M. Reynolds", "U. Schulthess"],
    "venue": "Frontiers in Plant Science",
    "tldr": "In this communication we present a case study on the use of time series SkySat images to estimate NDVI from wheat and maize breeding plots encompassing different sizes and spacing.",
    "abstract": ""
  },
  {
    "id": "Using",
    "x": 1.2782,
    "y": -0.2982,
    "z": 1.4014,
    "title": "Using RGISTools to Estimate Water Levels in Reservoirs and Lakes",
    "citations": 8,
    "doi": "10.3390/rs12121934",
    "year": 2020,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["A. F. Militino", "Manuel Montesino-SanMartin", "U. P\u00e9rez-Goya", "M. Ugarte"],
    "venue": "Remote Sensing",
    "tldr": "The combination of freely accessible satellite imagery from multiple programs improves the spatio-temporal coverage of remote sensing data, but it exhibits barriers regarding the variety of web services, file formats, and data standards.",
    "abstract": ""
  },
  {
    "id": "Fusion",
    "x": 1.2856,
    "y": -0.3007,
    "z": 1.2519,
    "title": "Fusion of Sentinel-2 and Sentinel-3 Images for Producing Daily Maps of Advected Aerosols at Urban Scale",
    "citations": 1,
    "doi": "10.3390/rs18010116",
    "year": 2025,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["L. Alparone", "Massimo Bianchini", "Andrea Garzelli", "S. Lolli"],
    "venue": "Remote Sensing",
    "tldr": "In this study, the authors wish to introduce an unsupervised procedure designed for real-time generation of maps depicting advected aerosols, specifically focusing on desert dust and smoke originating from biomass combustion.",
    "abstract": ""
  },
  {
    "id": "Harnessing",
    "x": 1.3161,
    "y": -0.334,
    "z": 1.4726,
    "title": "Harnessing the Power of Machine Learning for Mapping of Iron Oxide Mineralization using Sentinel Satellite Spectral Imagery",
    "citations": 0,
    "doi": "10.1109/IBCAST54850.2022.9990084",
    "year": 2022,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Muhammad Ahsan Mahboob", "B. Genc", "Iqra Atif"],
    "venue": "International Bhurban Conference on Applied Sciences and Technology",
    "tldr": "In recent decades, satellite-based mineral exploration has been recognized as one of the most cost-effective and time-efficient tools for regional exploration.",
    "abstract": ""
  },
  {
    "id": "Uncertainty",
    "x": 0.9953,
    "y": -0.7134,
    "z": 1.4412,
    "title": "Uncertainty Quantification in QGIS-Based Satellite Image Analysis",
    "citations": 0,
    "doi": "10.1109/IC2PCT68894.2026.11584386",
    "year": 2026,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Kunal Singh Mandhan", "Lovejeet Patel", "Shion Shibu", "Mukesh Kumar Verma", "S. Kaswan"],
    "venue": "2026 IEEE 6th International Conference on Computing, Power, and Communication Technologies (IC2PCT)",
    "tldr": "The environmental assessment, climate studies, and land management all use satellite-based vegetation monitoring.",
    "abstract": ""
  },
  {
    "id": "Comparison",
    "x": 1.3109,
    "y": -0.2809,
    "z": 1.4528,
    "title": "Comparison of In-Situ Temperature and Satellite Retrieved Temperature in Determining Geothermal Potential in Jaboi Field, Sabang",
    "citations": 5,
    "doi": "10.1088/1742-6596/1116/3/032008",
    "year": 2018,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["D. P. Cesarian", "I. Abir", "M. Isa"],
    "venue": "Journal of Physics, Conference Series",
    "tldr": "Current technological advancement in remote sensing makes it possible to map potential geothermal hotspots for a large area effectively using thermal infrared sensors.",
    "abstract": ""
  },
  {
    "id": "Monitoring",
    "x": 0.8217,
    "y": -0.4953,
    "z": 1.2714,
    "title": "Monitoring Seawater Quality in the Kali Porong Estuary as an Area for Lapindo Mud Disposal leveraging Google Earth Engine",
    "citations": 4,
    "doi": "10.1088/1755-1315/936/1/012011",
    "year": 2021,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["F. Bioresita", "Muhammad Hidayatul Ummah", "M. Wulansari", "Nabilla Aprilia Putri"],
    "venue": "IOP Conference Series: Earth and Environment",
    "tldr": "The hot mudflow released by Lapindo Mud Volcano periodically requires a large storage space.",
    "abstract": ""
  },
  {
    "id": "Land",
    "x": 1.1579,
    "y": -0.5883,
    "z": 1.3518,
    "title": "Land cover classification based optical satellite images using machine learning algorithms",
    "citations": 6,
    "doi": "10.26555/ijain.v8i3.803",
    "year": 2022,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["A. Razafinimaro", "A. R. Hajalalaina", "H. Rakotonirainy", "Reziky Zafimarina"],
    "venue": "International Journal of Advances in Intelligent Informatics",
    "tldr": "In this paper, we examined the performance of DT, SVM, KNN, ANN, and RF.",
    "abstract": ""
  },
  {
    "id": "Enhancing",
    "x": 1.0073,
    "y": -0.4343,
    "z": 1.4753,
    "title": "Enhancing Landsat image based aboveground biomass estimation of black locust with scale bias-corrected LiDAR AGB map and stratified sampling",
    "citations": 15,
    "doi": "10.1080/10095020.2023.2249042",
    "year": 2023,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Shuhong Qin", "Hong Wang", "Xiuneng Li", "Jay Gao", "Jiaxin Jin", "Yongtao Li", "Jinbo Lu", "Pengyu Meng", "Jing Sun", "Zhenglin Song", "Petar Donev", "Zhangfeng Ma"],
    "venue": "Geo-Spatial Information Science",
    "tldr": "ABSTRACT There is a growing interest in leveraging LiDAR-generated forest Aboveground Biomass (LG-AGB) data as a reference to retrieve AGB from satellite observations.",
    "abstract": ""
  },
  {
    "id": "Fast",
    "x": 1.3556,
    "y": -0.6033,
    "z": 1.2736,
    "title": "Fast extraction of winter wheat planting area in Huang-Huai-Hai Plain using high-resolution satellite imagery on a cloud computing platform",
    "citations": 3,
    "doi": "10.25165/j.ijabe.20221501.6917",
    "year": 2021,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Dongyan Zhang", "Mengru Zhang", "Fenfang Lin", "Zhenggao Pan", "Fei Jiang", "Liang He", "Han Yang", "N. Jin"],
    "venue": "International Journal of Agricultural and Biological Engineering",
    "tldr": ": To extract regional winter wheat planting area using higher-resolution satellite imagery still faces many challenges due to large data size and long processing time in traditional remote sensing classification.",
    "abstract": ""
  },
  {
    "id": "Open-Source",
    "x": 1.145,
    "y": -0.3993,
    "z": 1.4575,
    "title": "Open-Source Software for Satellite-Based Crop Health Monitoring",
    "citations": 7,
    "doi": "10.1007/s42853-024-00242-z",
    "year": 2024,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["James Y. Kim"],
    "venue": "Journal of Biosystems Engineering",
    "tldr": "Timely information on agricultural crops is essential to support informed crop management decisions.",
    "abstract": ""
  },
  {
    "id": "Forest",
    "x": 1.0045,
    "y": -0.7031,
    "z": 1.4462,
    "title": "Forest Fire Prediction Using Machine Learning Techniques",
    "citations": 41,
    "doi": "10.1109/CONIT51480.2021.9498448",
    "year": 2021,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["T. Preeti", "Suvarna G. Kanakaraddi", "Aishwarya Beelagi", "Sumalata Malagi", "Aishwarya Sudi"],
    "venue": "2021 International Conference on Intelligent Technologies (CONIT)",
    "tldr": "Forest Fire Prediction is a key component of forest fire control.",
    "abstract": ""
  },
  {
    "id": "Compositing",
    "x": 1.2413,
    "y": -0.4635,
    "z": 1.1431,
    "title": "Compositing the Minimum NDVI for Daily Water Surface Mapping",
    "citations": 38,
    "doi": "10.3390/rs12040700",
    "year": 2020,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Xingwang Fan", "Yuanbo Liu", "Guiping Wu", "Xiaosong Zhao"],
    "venue": "Remote Sensing",
    "tldr": "Capturing high frequency water surface dynamics via optical remote sensing is important for understanding hydro-ecological processes over seasonally flooded wetlands.",
    "abstract": ""
  },
  {
    "id": "Classification",
    "x": 0.8288,
    "y": -0.4006,
    "z": 1.2369,
    "title": "Classification of forests in the precarpathian region using quickbird-2 high resolution satellite image",
    "citations": 0,
    "doi": "10.15576/GLL/2017.2.7",
    "year": 2017,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Andriy Babushka", "K. Burshtynska", "Y. Denys"],
    "venue": "Academic Conference",
    "tldr": "Based on the study of literature on the classification of forests using high resolution space images it was established that the separation of classes and classes close to the spectral brightness can not be identified with high accuracy.",
    "abstract": ""
  },
  {
    "id": "Meteorological",
    "x": 1.2407,
    "y": -0.6701,
    "z": 1.2297,
    "title": "Meteorological Analysis of Extreme Fires in Albania during the Period 2019–2025",
    "citations": 0,
    "doi": "10.9734/jgeesi/2025/v29i12983",
    "year": 2025,
    "clusterId": 3,
    "color": "#4DAF4A",
    "size": 0.2,
    "authors": ["Gazmir \u00c7ela", "Anira Gjoni", "Alban Doko", "F. Kadria", "Indrit Rexhepi", "O. Jaupaj"],
    "venue": "Journal of Geography Environment and Earth Science International",
    "tldr": "This study investigates the relationship between weather conditions and extreme fires in Albania during 2019–2025, aiming to assess the impact of atmospheric conditions on the occurrence, intensity, and spatial distribution of forest fires.",
    "abstract": ""
  },
  {
    "id": "Historical",
    "x": -2.2712,
    "y": 0.0813,
    "z": -0.6795,
    "title": "Historical urban growth, land surface temperature dynamics, and future land use and land cover projections in the Metropolitan Region of Vale do Aço",
    "citations": 0,
    "doi": "10.1007/s00704-026-06477-4",
    "year": 2026,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["P. Goncalves", "Arthur Amaral e Silva", "B. Marangon", "Edson Soares Fialho"],
    "venue": "Theoretical and Applied Climatology",
    "tldr": "Changes in Land Use and Land Cover (LULC), especially those associated with the urbanization process, play a fundamental role in intensifying phenomena such as heat islands.",
    "abstract": ""
  },
  {
    "id": "Mapping",
    "x": -2.4502,
    "y": 0.4747,
    "z": -0.4077,
    "title": "Mapping Impacts of Crude Oil theft and Illegal Refineries on Mangrove of the Niger Delta of Nigeria with Remote Sensing Technology",
    "citations": 17,
    "doi": "10.5901/MJSS.2015.V6N3P150",
    "year": 2015,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["T. F. Balogun"],
    "venue": "Academic Conference",
    "tldr": "Niger Delta is the oil rich region of Nigeria where extensive mangrove form one of the most important ecosystems of coastal and marine areas.",
    "abstract": ""
  },
  {
    "id": "Mangrove",
    "x": -2.6348,
    "y": 0.345,
    "z": -0.5576,
    "title": "Mangrove Management Information System in Southern Coast of Malang Indonesia Using Trend Moment Method",
    "citations": 0,
    "doi": "10.24857/rgsa.v19n5-009",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Gisanda Aliya Ramadhanty", "Erfan Rohadi", "Cahya Rahmad", "Nia Ambarsari", "P. Resmi", "Faqih Hamami"],
    "venue": "Revista de Gestão Social e Ambiental",
    "tldr": "Objective: The objective of this study is to investigate mangrove changes using satellite image from 2018 to 2023, then compared with in situ data in 2024 with the aim of developing an information system on mangrove vegetation of 18 beaches in Southern Coast of Malang, East Java, Indonesia.",
    "abstract": ""
  },
  {
    "id": "Deforestation",
    "x": -2.5066,
    "y": 0.3446,
    "z": -0.4733,
    "title": "Deforestation Monitoring in Different Brazilian Biomes: Challenges and Lessons",
    "citations": 4,
    "doi": "10.1109/LAGIRS48042.2020.9285976",
    "year": 2020,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["C. Almeida", "D. Valeriano", "L. Maurano", "L. Vinhas", "L. Fonseca", "D. Silva", "C. P. Santos", "F. Martins", "F. C. Lara", "J. S. Maia", "E. R. Profeta", "L. O. Santos", "F. Santos", "V. Ribeiro"],
    "venue": "2020 IEEE Latin American GRSS & ISPRS Remote Sensing Conference (LAGIRS)",
    "tldr": "In this article, we present some aspects of the evolution of this methodology, the key processes to produce accurate deforestation maps during the last 30 years and the new challenges that the Project would face.",
    "abstract": ""
  },
  {
    "id": "Assessment",
    "x": -2.1479,
    "y": 0.1635,
    "z": -0.5211,
    "title": "Assessment of the agricultural soil use by remote sensing (Perm Region, on the example of LLC “Krona-Agro”)",
    "citations": 0,
    "doi": "10.31862/2500-2961-2020-10-1-76-96",
    "year": 2020,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["A. Chashchin", "Vladimir P. Zhizhilev"],
    "venue": "Academic Conference",
    "tldr": "For rapid and accurate assessment of the agricultural soil use it is effective to use remote sensing methods.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": -2.3063,
    "y": 0.3798,
    "z": -0.8335,
    "title": "Análise das modificações ambientais decorrentes da ocupação urbana em Rio Grande, RS, entre 1947 e 2014, por meio de um Sistema de Informações Geográficas",
    "citations": 3,
    "doi": "10.5380/DMA.V38I0.46902",
    "year": 2016,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Giuliana Andr\u00e9ia Sfredo", "C. R. Tagliani"],
    "venue": "Academic Conference",
    "tldr": "This study aims to map and describe the environmental modifications occurred in the coastal city of Rio Grande, RS, between 1947 and 2014, resulting from the urbanization process whereby the municipality passed during the analyzed period.",
    "abstract": ""
  },
  {
    "id": "Habitat",
    "x": -2.4383,
    "y": 0.0628,
    "z": -0.587,
    "title": "Habitat Fragmentation by Land-Use Change: One-Horned Rhinoceros in Nepal and Red-Cockaded Woodpecker in Texas",
    "citations": 0,
    "doi": "10.12794/metadc33207",
    "year": 2010,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["V. Thapa"],
    "venue": "Academic Conference",
    "tldr": "This research focuses on the spatial analysis of the habitat of two vulnerable species, the one-horn rhinoceros in the grasslands of southern Nepal, and the red-cockaded woodpecker in the Piney woods of southeast Texas, in the USA.",
    "abstract": ""
  },
  {
    "id": "Transformations",
    "x": -2.2026,
    "y": 0.512,
    "z": -0.3556,
    "title": "Transformations of Vernacular Geographies: Changes in the Morphology of Residential Areas of Sentani in Indonesia",
    "citations": 0,
    "doi": "10.61275/isvsej-2024-11-04-03",
    "year": 2024,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Anriani Safar", "Idawarni J.", "Asmal", "E. Syarif", "A. Radja"],
    "venue": "ISVS e journal",
    "tldr": "Sentani is a city in Indonesia.",
    "abstract": ""
  },
  {
    "id": "Assessment",
    "x": -2.6455,
    "y": 0.3556,
    "z": -0.6262,
    "title": "Assessment of vegetation trend changes in the wild savannah-protected area of Mid Zambezi Valley",
    "citations": 4,
    "doi": "10.1080/27658511.2025.2542186",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Jeremiah Chakuya", "Manuel Ndebele"],
    "venue": "Sustainability in Environment",
    "tldr": "ABSTRACT Observations in the Zambezi Valley indicate vegetation loss caused by wildlife, mainly elephants, and natural vegetation die-offs.",
    "abstract": ""
  },
  {
    "id": "Environmental",
    "x": -2.4934,
    "y": 0.1737,
    "z": -0.4319,
    "title": "Environmental Assessment For Mapping Land Degradation and Lands Changes Using Remotely Sensed Data with Geospatial Analysis",
    "citations": 2,
    "doi": "10.22399/ijcesen.1045",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["G. Saba", "Yousef", "Hayder Dibs", "A. Naje"],
    "venue": "International Journal of Computational and Experimental Science and Engineering",
    "tldr": "Lands degradation is one of the problems that facing the humanity throughout the world as well as the abandonment of farming on their lands by farmers, in addition to the fragmentation of most orchards and agricultural fields and their conversion into residential areas, has a negative impact on the Economic, Environmental and Social (Reduced Agricultural Productivity, Economic Loss, Soil Degradation, Agricultural productivity.",
    "abstract": ""
  },
  {
    "id": "Effects",
    "x": -2.5564,
    "y": 0.2218,
    "z": -0.3419,
    "title": "Effects of Climate Change, Land Use and Land Cover Variability on Green and Blue Water in Wami/Ruvu Basin, Tanzania",
    "citations": 5,
    "doi": "10.4314/tjs.v49i1.22",
    "year": 2023,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Benson HM Lazaro", "M. Hagai", "R. Mato"],
    "venue": "Tanzania Journal of Science",
    "tldr": "Water basins are the primary food sources, giving green water and blue water worldwide.",
    "abstract": ""
  },
  {
    "id": "The",
    "x": -2.2014,
    "y": 0.5115,
    "z": -0.5767,
    "title": "The use of MCDA in forest health risk assessment for an effective geoenvironmental management of Divjake Karavasta National Park",
    "citations": 0,
    "doi": "10.33422/icarss.v2i1.1036",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["E. Begu", "S. Sinjari", "Romeo Hanxhari", "Xhulia Bygjymi", "D. Prifti"],
    "venue": "Proceedings of the International Conference on Advanced Research in Social Sciences",
    "tldr": "Forest health refers to the overall ecological and functional condition of a forest, which affects its ability to support biodiversity, regulate the climate and provide natural resources for people and the surrounding environment.",
    "abstract": ""
  },
  {
    "id": "Forest",
    "x": -2.4264,
    "y": 0.4192,
    "z": -0.319,
    "title": "Forest Belts in the Dry Steppes of the Altai Region: Assessment of the Current State",
    "citations": 0,
    "doi": "10.18384/2712-7621-2025-1-6-26",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["A. A. Shigimaga", "N. I. Bykov", "N. Rygalova"],
    "venue": "Geographical Environment and Living Systems",
    "tldr": "Assessment of the state of forest shelterbelts in the dry-steppe subzone of the Altai Territory and identification of key factors contributing to their degradation and area reduction.Methodology.",
    "abstract": ""
  },
  {
    "id": "Pemetaan",
    "x": -2.5247,
    "y": 0.0922,
    "z": -0.3173,
    "title": "Pemetaan Temporal Perubahan Penggunaan Lahan Kelapa Sawit di Kecamatan Babulu, Penajam Paser Utara",
    "citations": 0,
    "doi": "10.30872/jatl.8.1.2025.19541.49-55",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Yudiansyah Yudiansyah", "Yoga Toyibulah"],
    "venue": "Jurnal Agroekoteknologi Tropika Lembab",
    "tldr": "Babulu District in Penajam Paser Utara Regency, East Kalimantan, is an area with high potential in the development of oil palm plantations.",
    "abstract": ""
  },
  {
    "id": "Rock",
    "x": -2.6201,
    "y": 0.4516,
    "z": -0.6014,
    "title": "Rock type discrimination using Landsat-8 OLI satellite data in mafic-ultramafic terrain",
    "citations": 2,
    "doi": "10.7494/geol.2023.49.3.281",
    "year": 2023,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["K. Tamilarasan", "S. Anbazhagan", "S. Ranjithkumar"],
    "venue": "Geology Geophysics & Environment",
    "tldr": "The mafic-ultramafic terrain of the Bhavani complex in southern India is considered for lithological mapping.",
    "abstract": ""
  },
  {
    "id": "Estudio",
    "x": -2.2555,
    "y": 0.3154,
    "z": -0.4512,
    "title": "Estudio de bofedales en los Andes ecuatorianos a través de la comparación de imágenes Landsat-8 y Sentinel-2",
    "citations": 14,
    "doi": "10.4995/RAET.2019.11715",
    "year": 2019,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Carlos Jara", "J. Delegido", "J. Ayala", "P. Lozano", "A. Armas", "V. Flores"],
    "venue": "Revista de Teledetección",
    "tldr": "The objective of the present study was to compare the Landsat-8 and Sentinel-2 images to calculate the wetland´s extension, distribution and degree of conservation, in Reserva de Producción de Fauna Chinborazo (RPFCH) protected area located in the Andean region of Ecuador.",
    "abstract": ""
  },
  {
    "id": "Sandy",
    "x": -2.4167,
    "y": 0.1852,
    "z": -0.4198,
    "title": "Sandy soil spots in northwestern Paraná: approaches for identification and quantification",
    "citations": 0,
    "doi": "10.20502/rbg.v25i4.2614",
    "year": 2024,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["L. Santos", "Jos\u00e9 Guilherme Oliveira", "F. Breunig", "Marcia Regina Calegari", "Elias Fernando Berra", "Jonez Fidalski"],
    "venue": "Revista Brasileira de Geomorfologia",
    "tldr": "The predominance of sandy soils in the Northwest region of the state of Paraná, associated with the removal of natural vegetation, favored the development of patches of white sand on the surface without any aggregation.",
    "abstract": ""
  },
  {
    "id": "Environmental",
    "x": -2.268,
    "y": 0.513,
    "z": -0.7339,
    "title": "Environmental, demographic and policy drivers of change in mediterranean hedgerow landscape (Central Spain)",
    "citations": 4,
    "doi": "10.1016/J.LANDUSEPOL.2021.105342",
    "year": 2021,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["F. A. Alvarez", "G. Mediavilla", "N. L. Est\u00e9banez"],
    "venue": "Academic Conference",
    "tldr": "Abstract The present paper combines the classification of hedgerows in relation to surface soil moisture with the consideration of drivers of change (environmental, demographic, and policy) affecting the areal extent of hedgerow land cover in central Spain.",
    "abstract": ""
  },
  {
    "id": "Impacts",
    "x": -2.6222,
    "y": 0.4838,
    "z": -0.5816,
    "title": "Impacts of Urbanization Rate and Land Cover Change on Urban Farm Land: A Case of Wolayta Zone Sodo Zuria Woreda",
    "citations": 1,
    "doi": "10.7176/cer/13-3-03",
    "year": 2021,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Bereket Geberselassie Assa"],
    "venue": "Civil and environmental research",
    "tldr": "The effect of human intervention on the agricultural system has shown food insecurity with an increase in the cost of crop production in the local market due to the expansion of urbanization in the study area with 2.66% in 9 years for the demand of residential land.",
    "abstract": ""
  },
  {
    "id": "Avalia",
    "x": -2.5696,
    "y": 0.1155,
    "z": -0.3589,
    "title": "Avaliação da precipitação estimada por sensor orbital no Pantanal Mato-Grossense",
    "citations": 3,
    "doi": "10.26848/RBGF.V14.5.P2700-2710",
    "year": 2021,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Yngrid Nantes Henriques Schuartz", "Victor Hugo de Moraes Danelichen", "Osvaldo Alves Pereira", "Raymerson Rodrigues da Silva"],
    "venue": "Academic Conference",
    "tldr": "Neste trabalho foi realizada uma analise comparativa entre dados de precipitacao observados e dados de precipitacao estimados pelo satelite TRMM, com o objetivo de avaliar a eficiencia da precipitacao estimada pelo sensor orbital em tres sitios experimentais do bioma Pantanal mato-grossense localizadas proximas a Reserva Particular do Patrimonio Natural (RPPN) Sesc Pantanal, no municipio de Barao de Melgaco, considerada a maior reserva particular natural do Brasil, distante 160 km de Cuiaba, MT.",
    "abstract": ""
  },
  {
    "id": "GEOTECNOLOGIAS",
    "x": -2.2936,
    "y": 0.4278,
    "z": -0.6607,
    "title": "GEOTECNOLOGIAS NO DIAGNÓSTICO DE CONFLITOS DE USO DO SOLO DE UMA MICROBACIA DO MUNICÍPIO DE ALTA FLORESTA - MT",
    "citations": 5,
    "doi": "10.5902/1980509819619",
    "year": 2015,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Emanoel Junior da Silva Nunes", "E. Silva", "Eliana Barbosa de Souza", "J. D. R. Filho", "D. Silva"],
    "venue": "Academic Conference",
    "tldr": "The purpose of this study is to use geotechnology in mapping the soil cover and diagnose conflicts of land use in permanent preservation areas (PPA) for a microbasin with an area of ​​17,759 ha located in the municipality of Alta Floresta, in Mato Grosso State.",
    "abstract": ""
  },
  {
    "id": "Impact",
    "x": -2.2978,
    "y": 0.4999,
    "z": -0.7237,
    "title": "Impact of Atmospheric Correction on Land Cover Classification of the Topographic Chart  SC-24-V-C (Petrolina) Using Google Earth Engine and Landsat-8 images",
    "citations": 0,
    "doi": "10.11137/2019_2_100_116",
    "year": 2019,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["K. A. Ganem", "G. Baptista", "W. F. Rocha", "R. N. Vasconcellos", "M. Rosa", "D. T. M. Souza"],
    "venue": "Anuário do Instituto de Geociências",
    "tldr": "It is known that mapping land cover through remote sensing techniques is not a trivial procedure and it requires a high level of knowledge of the processing techniques adopted.",
    "abstract": ""
  },
  {
    "id": "Evoluci",
    "x": -2.2975,
    "y": 0.529,
    "z": -0.6705,
    "title": "Evolución del delta del río Paraná y su posible vinculación con el calentamiento global",
    "citations": 13,
    "doi": "10.22179/REVMACN.15.181",
    "year": 2013,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["R. A. Medina", "J. Codignotto"],
    "venue": "Academic Conference",
    "tldr": "Evolution of the Parana River Delta and its possible relationship to Global warming.",
    "abstract": ""
  },
  {
    "id": "INFORMA",
    "x": -2.4712,
    "y": 0.4009,
    "z": -0.471,
    "title": "INFORMAÇÕES GEOLÓGICO-GEOMORFOLÓGICAS COMO SUBSÍDIOS À ANÁLISE AMBIENTAL: O EXEMPLO DA PLANÍCIE COSTEIRA DE CARAVELAS - BAHIA",
    "citations": 19,
    "doi": "10.5380/GEO.V51I0.4167",
    "year": 2002,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Ana Cl\u00e1udia da Silva Andrade"],
    "venue": "Academic Conference",
    "tldr": "A zona costeira de Caravelas, situada no extremo sul da Bahia, apresenta ricos ecossistemas terrestres e aquaticos, incluindo o complexo recifal dos Abrolhos, considerado o mais importante do Atlântico Sul Ocidental.",
    "abstract": ""
  },
  {
    "id": "Urbanization",
    "x": -2.6456,
    "y": 0.3708,
    "z": -0.5023,
    "title": "Urbanization: A Catalyst for the Emergence of Squatter Settlements and Squalor in the Vicinities of the Federal Capital City of Nigeria",
    "citations": 21,
    "doi": "10.5539/JSD.V8N2P134",
    "year": 2015,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["Opeyemi A. Zubair", "L. M. Ojigi", "R. Mbih"],
    "venue": "Academic Conference",
    "tldr": "From the 1990s to date, growing deterioration of urban environmental quality, and the developments of squatter settlements and squalors have gradually become the attributes of the development patterns in the Federal Capital City (FCC), Abuja and environs in Nigeria.",
    "abstract": ""
  },
  {
    "id": "Interactive",
    "x": -2.273,
    "y": 0.3084,
    "z": -0.3458,
    "title": "Interactive community-based tropical forest monitoring using emerging technologies",
    "citations": 3,
    "doi": "10.18174/357908",
    "year": 2015,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["A. Pratihast"],
    "venue": "Academic Conference",
    "tldr": "Forests cover approximately 30% of the Earth’s land surface and have played an indispensable role in the human development and preserving natural resources.",
    "abstract": ""
  },
  {
    "id": "Land",
    "x": -2.7,
    "y": 0.3145,
    "z": -0.463,
    "title": "Land Degradation Detection in Urban Areas Using Spatial Modelling and Semi-Automatic Classification of Satellite Imagery Data",
    "citations": 2,
    "doi": "10.53623/tasp.v5i2.775",
    "year": 2025,
    "clusterId": 4,
    "color": "#984EA3",
    "size": 0.2,
    "authors": ["R. Purnamasari", "M. Setiawan", "Wardah Wardah"],
    "venue": "Tropical Aquatic and Soil Pollution",
    "tldr": "Urban land degradation poses a growing challenge in rapidly developing countries like Indonesia, where population growth and limited space drive uncontrolled land cover changes.",
    "abstract": ""
  },
  {
    "id": "Photogrammetric",
    "x": 0.1128,
    "y": -1.617,
    "z": -1.5805,
    "title": "Photogrammetric Techniques and UAV for Drainage Pattern and Overflow Assessment in Mountainous Terrains - Hatta/UAE",
    "citations": 2,
    "doi": "10.1109/IGARSS.2019.8898151",
    "year": 2019,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["S. Almansoori", "R. Al-Ruzouq", "Diena Al Dogom", "M. Al Shamsi", "Alya Al Mazzm", "N. Aburaed"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "Accurate and precise spatial hydrologic information is essential for effective management of natural resources, planning, and disaster response.",
    "abstract": ""
  },
  {
    "id": "Methodology",
    "x": 0.292,
    "y": -1.4208,
    "z": -1.6624,
    "title": "Methodology of mapping of historical and cultural heritage objects by GIS technologies using archival cartographic and aerial materials",
    "citations": 1,
    "doi": "10.33841/1819-1339-1-41-97-103",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["B. Chetverikov", "O. Khintsitsky", "I. Kalynych"],
    "venue": "Academic Conference",
    "tldr": "The purpose of the work is to process archival cartographic materials and remote sensing data for the interpretation of objects of historical and cultural heritage (OHCH) of Cherkasy, including those that have not been preserved.",
    "abstract": ""
  },
  {
    "id": "Large-scale",
    "x": 0.0656,
    "y": -1.288,
    "z": -1.7367,
    "title": "Large-scale geomorphological mapping of the Malaya Sosva  state nature reserve",
    "citations": 0,
    "doi": "10.47148/1609-364x-2021-2-59-66",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["A. Pshenichnikov", "Konstantin Dektjarev"],
    "venue": "Geoinformatika",
    "tldr": "The Malaya Sosva State Nature Reserve is situated in the west of the Khanty-Mansiysk Au-tonomous Region — Ugra.",
    "abstract": ""
  },
  {
    "id": "GEOINFORMATION",
    "x": 0.309,
    "y": -1.2599,
    "z": -1.4828,
    "title": "GEOINFORMATION MAPPING OF ANTHROPOGENICALLY TRANSFORMED LANDSCAPES OF BILA TSERKVA (UKRAINE)",
    "citations": 7,
    "doi": "10.15576/asp.fc/2022.21.1.69",
    "year": 2022,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["V. Belenok", "L. Hebryn-Baidy", "N. B\u0456elousova", "H. Zavarika", "O. Sakal", "Andriy Kovalenko"],
    "venue": "Acta Scientiarum Polonorum. Formatio Circumiectus",
    "tldr": "Aim of the study: The main purpose of the study is the analysis and assessment of anthropogenically transformed landscapes of Bila Tserkva (Ukraine) based on a combination of remote sensing methods and GIS mapping Material and methods: Usage of geoinformatics methods for mapping anthropogenically transformed landscapes of Bila Tserkva is studied.",
    "abstract": ""
  },
  {
    "id": "GEODESY",
    "x": 0.2266,
    "y": -1.4208,
    "z": -1.4382,
    "title": "GEODESY, CARTOGRAPHY AND AERIAL PHOTOGRAPHY",
    "citations": 4,
    "doi": "10.23939/istcgcap2022.95.077",
    "year": 2022,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["I. Kalynych", "Mariya Nychvyd", "I. Prodanets", "N. Kablak", "Yaroslav Vash"],
    "venue": "GEODESY CARTOGRAPHY AND AERIAL PHOTOGRAPHY",
    "tldr": "This article is devoted to the study of geodynamic processes in the Tysza River basin within the Transcarpathian region with an analysis of geodetic observations obtained over the past decade.",
    "abstract": ""
  },
  {
    "id": "Hydro-morphodynamic",
    "x": 0.2431,
    "y": -1.5483,
    "z": -1.4814,
    "title": "Hydro-morphodynamic modelling in Mediterranean storms – errors and uncertainties under sharp gradients",
    "citations": 30,
    "doi": "10.5194/NHESS-14-2993-2014",
    "year": 2014,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["A. Sanchez-arcilla", "M. Garc\u00eda-Le\u00f3n", "V. Gracia"],
    "venue": "Academic Conference",
    "tldr": "This paper deals with the limits in hydrodynamic and morphodynamic predictions for semi-enclosed coastal domains subject to sharp gradients (in bathymetry, topography, sediment transport and coastal damages).",
    "abstract": ""
  },
  {
    "id": "Above",
    "x": -0.1554,
    "y": -1.3024,
    "z": -1.5828,
    "title": "Above the Impact Zone: Aerial Imaging with AI-Based Rapid Flood Inundation Assessment Using EXIF-Tagged Imagery and Drone-to-Satellite Comparison",
    "citations": 0,
    "doi": "10.65138/ijprse.2026.v7i05.1293",
    "year": 2026,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Vee Jay S. Lee", "Aira Mae L. Marcelo", "Lorenz S. Trinidad", "Kennedy V. Rodriguez", "Reynaldo L. De Asis"],
    "venue": "International Journal of Progressive Research in Science and Engineering",
    "tldr": "Flood assessment in local disaster response is often delayed by limited access to inundated areas and reliance on ground-based observation.",
    "abstract": ""
  },
  {
    "id": "SPATIAL",
    "x": 0.1786,
    "y": -1.5841,
    "z": -1.5073,
    "title": "SPATIAL ANALYSIS OF THE FLOODED LAND AREA OF THE KHERSON REGION NATURE RESERVE USING REMOTE SENSING DATA",
    "citations": 3,
    "doi": "10.17721/1728-2713.109.14",
    "year": 2025,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["\u0406. Stakhiv", "V. Zatserkovnyi", "Mauro De Donatis", "T. Pastushenko", "S. Hordiichuk", "T. Malik"],
    "venue": "Visnyk of Taras Shevchenko National University of Kyiv. Geology",
    "tldr": "The ongoing war in Ukraine has become the largest armed conflict in the world in the last decade, causing unprecedented destruction and devastation of the country's natural landscapes.",
    "abstract": ""
  },
  {
    "id": "To",
    "x": -0.0089,
    "y": -1.5945,
    "z": -1.5148,
    "title": "To the question of the environmental education: how Landsat TM, ETM+ and MSS images can be processed by GIS-techniques for geospatial research",
    "citations": 3,
    "doi": "10.6084/M9.FIGSHARE.7211600",
    "year": 2015,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Polina Lemenkova"],
    "venue": "Academic Conference",
    "tldr": "The emphasis of this research is to demonstrate application of Landsat satellite imagery as a major resource for student and educational research.",
    "abstract": ""
  },
  {
    "id": "Groundwater",
    "x": -0.1998,
    "y": -1.4363,
    "z": -1.5267,
    "title": "Groundwater Complexity in Urban Catchments: Shenzhen, Southern China",
    "citations": 13,
    "doi": "10.1111/gwat.12935",
    "year": 2019,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["M. Lancia", "C. Zheng", "Xin He", "D. Lerner", "C. Andrews"],
    "venue": "Ground Water",
    "tldr": "Groundwater interactions with surface water and sewers in an urban setting are complex, and classic hydrogeological approaches must be combined with anthropogenic elements to characterize them.",
    "abstract": ""
  },
  {
    "id": "Assessment",
    "x": 0.0741,
    "y": -1.3844,
    "z": -1.802,
    "title": "Assessment of Environmental Changes of Valley of the Undytkan River in Impact Zone of the Elginsky Coal Complex and the Railway Track “Ulak- Elga” with Use of Ground and Remote Methods",
    "citations": 1,
    "doi": "10.1088/1755-1315/666/6/062034",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["D. Pinigin", "N. Nikolaeva", "D. D. Nogovitsyn"],
    "venue": "Academic Conference",
    "tldr": "Environmental monitoring studies are of primary importance to assess the characteristics of anthropogenic changes in the environment on the territory of the Elginsky coking coal deposit, which is one of the largest resource potential of the Republic of Sakha (Yakutia).",
    "abstract": ""
  },
  {
    "id": "Flood",
    "x": 0.3177,
    "y": -1.5473,
    "z": -1.5048,
    "title": "Flood hazard assessment in large plain basins with a scarce slope in the Pampean Plain, Argentina",
    "citations": 11,
    "doi": "10.1007/s10661-021-08988-1",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["G. Borzi", "A. Roig", "C. Tanjal", "L. Santucci", "Macarena Tejada Tejada", "E. Carol"],
    "venue": "Environmental Monitoring & Assessment",
    "tldr": "Floods are one of the most common natural phenomena and represent a serious hazard when they affect human activities.",
    "abstract": ""
  },
  {
    "id": "Mapping",
    "x": 0.012,
    "y": -1.4773,
    "z": -1.2661,
    "title": "Mapping and Zoning of Flood Hazard: Case Study of the Ouad Lahdar Valley at the Meknassa Al Gharbiya Territorial Center, Upper Inaouene, Morocco (Application of the Hydrogeomorphological Method)",
    "citations": 0,
    "doi": "10.59573/emsj.8(2).2024.43",
    "year": 2024,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Hamid Fattasse", "Jaouad Gartet", "M. Makhchane", "Marouane Laaraj", "Kamal Lahrichi", "A. Okacha"],
    "venue": "European Modern Studies Journal",
    "tldr": "The present study aims to map flood hazard in the Ouad valley, specifically focusing on the Meknassa El Gharbiya Territorial Center (the downstream part of the Ouad Lahdar watershed).",
    "abstract": ""
  },
  {
    "id": "Utilization",
    "x": -0.0678,
    "y": -1.3455,
    "z": -1.6671,
    "title": "Utilization of Satellite Imagery and Integration of the HVSR Inversion Method for Coastline Changes in the Nangai Beach Tourism Area, North Bengkulu Regency",
    "citations": 1,
    "doi": "10.14710/buloma.v14i3.68258",
    "year": 2025,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Putri Helinnes", "A. Hadi", "M. Farid", "Yuni Setyowati", "Debi Hardiansa", "Usman Gumanty", "Hana Raihana", "A. Al-Ansory", "Zaky Muammar"],
    "venue": "BULETIN OSEANOGRAFI MARINA",
    "tldr": "This research analyzes shoreline changes in the Nangai Beach area; North Bengkulu Regency using Satellite Image data and analyzes subsurface structures using the Horizontal to Vertical Spectral Ratio (HVSR) method.",
    "abstract": ""
  },
  {
    "id": "Aperiodic",
    "x": -0.0184,
    "y": -1.5239,
    "z": -1.3121,
    "title": "Aperiodic embayed sandy beach rotation and erosion-risk exposure on a hyper-muddy wave-exposed coast",
    "citations": 0,
    "doi": "10.5194/egusphere-egu2020-10487",
    "year": 2020,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["E. Anthony", "A. Gardel", "Morgane Jolivet", "G. Brunier", "F. Dolique"],
    "venue": "Academic Conference",
    "tldr": "<p><span>The 1500 km-long wave-exposed coast of the Guianas, South America, is characterized at any time by up to 20+ large distinct mud banks with suspended mud concentrations of up to 1000 g/l migrating from the Amazon delta to the Orinoco delta under the influence of wave-driven longshore transport.",
    "abstract": ""
  },
  {
    "id": "Detection",
    "x": 0.1002,
    "y": -1.5555,
    "z": -1.4985,
    "title": "Detection of the Change in the Morphology of the Courses of the River Ganga Using Satellite-derived Data: A Case Study Area",
    "citations": 1,
    "doi": "10.31305/rrijm.2021.v06.i12.014",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Mukesh Kumar", "A. R. Siddiqui"],
    "venue": "RESEARCH REVIEW International Journal of Multidisciplinary",
    "tldr": "This study seeks to examine the detection of course change in one of the major rivers of India, that is the Ganga, between the period of 1980 to 2020 and utilizes satellite driven data to demonstrate the visibility of shifting in its course.",
    "abstract": ""
  },
  {
    "id": "Arazi",
    "x": 0.2876,
    "y": -1.5458,
    "z": -1.4851,
    "title": "Arazi Kullanımdaki Zamansal Değişimin Kıyı Kenar Çizgisi ve Mülkiyet Açısından Değerlendirilmesi: Erzin İlçesi Örneği",
    "citations": 0,
    "doi": "10.31590/ejosat.956465",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Faz\u0131l Nacar"],
    "venue": "European Journal of Science and Technology",
    "tldr": "Coasts are places where sectors such as settlement, transportation, tourism and trade are intensely carried out by their natural resources and people.",
    "abstract": ""
  },
  {
    "id": "Application",
    "x": 0.0427,
    "y": -1.5002,
    "z": -1.7034,
    "title": "Application and research of GIS intelligent environmental protection Internet of things system construction technology",
    "citations": 3,
    "doi": "10.1109/ITCA49981.2019.00014",
    "year": 2019,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Yunli Cheng", "Linling Zhao"],
    "venue": "2019 International Conference on Information Technology and Computer Application (ITCA)",
    "tldr": "the wisdom of this project is based on GIS environmental iot system building technical application and research, is the use of geographic space information technology, satellite remote sensing technology, global satellite positioning technology, radio frequency identification technology, based on the electronic map, image data, which is based on Internet, metropolitan area network, or LAN, in different spatial location of environmentally friendly iot devices intuitive visual control, intelligent identification, location and tracking, monitoring, alarm, inspection and maintenance of various environmental iot information flow, gathering and processing and statistical analysis, system management and comprehensive application of socialized service system.",
    "abstract": ""
  },
  {
    "id": "Hydrological",
    "x": -0.2674,
    "y": -1.3824,
    "z": -1.4747,
    "title": "Hydrological Modeling of Murray River Basin Using The Hydrological Simulation Program-FORTRAN Model",
    "citations": 1,
    "doi": "10.1109/ICSPC47137.2019.9068009",
    "year": 2019,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Salimeh Malekpour Heydari", "T. N. M. Aris", "R. Yaakob", "H. Hamdan"],
    "venue": "IEEE Conference on Systems, Process and Control",
    "tldr": "Snow Water Equivalent can be a field for modeling runoff in mountainous catchments.",
    "abstract": ""
  },
  {
    "id": "Morphometric",
    "x": 0.0151,
    "y": -1.5531,
    "z": -1.5978,
    "title": "Morphometric and Structural Evaluations of Satellite Data from the Bosumtwi Impact Structure and Adjacent Areas in Ashanti, Ghana",
    "citations": 5,
    "doi": "10.24018/EJGEO.2021.2.3.137",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["B. Theilen-Willige"],
    "venue": "Academic Conference",
    "tldr": "The Bosumtwi impact crater in Ashanti, Ghana is one of the most thoroughly investigated impact structures in Africa.",
    "abstract": ""
  },
  {
    "id": "Feasibility",
    "x": 0.2072,
    "y": -1.3168,
    "z": -1.6551,
    "title": "Feasibility of satellite image and GIS sampling for population representative surveys: a case study from rural Guatemala",
    "citations": 11,
    "doi": "10.1186/s12942-020-00250-0",
    "year": 2020,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["A. Miller", "P. Rohloff", "Alexandre Blake", "Eloin Dhaenens", "Leah Shaw", "E. Tuiz", "F. Grandesso", "Carlos Mendoza Montano", "Dana R. Thomson"],
    "venue": "International Journal of Health Geographics",
    "tldr": "Background Population-representative household survey methods require up-to-date sampling frames and sample designs that minimize time and cost of fieldwork especially in low- and middle-income countries.",
    "abstract": ""
  },
  {
    "id": "METHODOLOGY",
    "x": -0.1246,
    "y": -1.3447,
    "z": -1.5435,
    "title": "METHODOLOGY OF REMOTE SENSING DATA INTEGRATION INTO REGIONAL SOIL INFORMATION SYSTEMS FOR SOIL MORPHOGENETIC PROPERTIES ANALYSIS AND LAND USE OPTIMIZATION",
    "citations": 0,
    "doi": "10.25128/2519-4577.26.1.1",
    "year": 2026,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Taras Yamelynets", "Z. Pankiv", "Andriy Kyrylchuk", "Oleksiy Teleguz", "H. Ivanyuk"],
    "venue": "THE SCIENTIFIC ISSUES OF TERNOPIL VOLODYMYR HNATIUK NATIONAL PEDAGOGICAL UNIVERSITY. SERIES: GEOGRAPHY",
    "tldr": "The research addresses the fundamental scientific and practical problem of the qualitative discrepancy between outdated soil mapping materials and the contemporary needs of sustainable land management, precision agriculture, and environmental monitoring in Ukraine.",
    "abstract": ""
  },
  {
    "id": "pt_5_22",
    "x": -0.22,
    "y": -1.2831,
    "z": -1.4115,
    "title": "Індикативний ландшафтний моніторинг національних природних парків (на прикладі території НПП «Слобожанський»)",
    "citations": 4,
    "doi": "10.26565/2410-7360-2018-49-15",
    "year": 2018,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["\u0410. \u041e\u0432\u0447\u0430\u0440\u0435\u043d\u043a\u043e", "\u041e\u043a\u0441\u0430\u043d\u0430 \u0412\u0456\u043a\u0442\u043e\u0440\u0456\u0432\u043d\u0430 \u0417\u0430\u043b\u044e\u0431\u043e\u0432\u0441\u044c\u043a\u0430"],
    "venue": "Academic Conference",
    "tldr": "National Natural Parks (NNP) – protected areas where anthropogenic and natural landscapes are combined in the same territory.",
    "abstract": ""
  },
  {
    "id": "Monitoring",
    "x": 0.3334,
    "y": -1.2374,
    "z": -1.5102,
    "title": "Monitoring of erosion processes according to the data of satellite observations",
    "citations": 0,
    "doi": "10.33730/2077-4893.3.2015.317692",
    "year": 2015,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["S. Truskavetskiy", "K. Vyatkin", "A. Sherstiuk"],
    "venue": "Agroecological journal",
    "tldr": "The article considers approaches to erosion processes assessment on large areas with the use of satellite survey.",
    "abstract": ""
  },
  {
    "id": "Monitoring",
    "x": -0.1606,
    "y": -1.5052,
    "z": -1.5402,
    "title": "Monitoring of Damages to Cultural Heritage across Europe Using Remote Sensing and Earth Observation: Assessment of Scientific and Grey Literature",
    "citations": 27,
    "doi": "10.3390/rs15153748",
    "year": 2023,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["B. Cuca", "F. Zaina", "D. Tapete"],
    "venue": "Remote Sensing",
    "tldr": "This research is part of a wider framework of index literature studies that have been conducted in the past few years.",
    "abstract": ""
  },
  {
    "id": "pt_5_25",
    "x": -0.2201,
    "y": -1.3124,
    "z": -1.3881,
    "title": "ОСОБЕННОСТИ ПРОВЕДЕНИЯ КЛАССИФИКАЦИИ ЗЕМЕЛЬ СЕЛЬСКОХОЗЯЙСТВЕННОГО НАЗНАЧЕНИЯ НА ОСНОВЕ ДАННЫХ ДИСТАНЦИОННОГО ЗОНДИРОВАНИЯ ЗЕМЛИ",
    "citations": 0,
    "doi": "10.26178/ae.2025.12.48.001",
    "year": 2025,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["\u041c.\u0412. \u041a\u043e\u043b\u043e\u0434\u044f\u0436\u043d\u044b\u0439", "\u0412.\u0424. \u041f\u043e\u043f\u043e\u0432\u0438\u0447", "\u0415\u043b\u0435\u043d\u0430 \u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432\u043d\u0430 \u0414\u0443\u043d\u0430\u0435\u0432\u0430", "\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0421\u0442\u0435\u043f\u0430\u043d\u043e\u0432\u0438\u0447 \u041f\u0430\u0448\u0442\u0435\u0446\u043a\u0438\u0439"],
    "venue": "ПРОБЛЕМЫ АГРОХИМИИ И ЭКОЛОГИИ",
    "tldr": "Идентификация земель сельскохозяйственного назначения (ЗСН) является первоначальным шагом при анализе сельскохозяйственных полей.",
    "abstract": ""
  },
  {
    "id": "Latitudinal",
    "x": 0.2436,
    "y": -1.3959,
    "z": -1.3076,
    "title": "Latitudinal and Situational Zonation of Coastal Catenary Sequences Observed from Satellite Images Using the Biophysical Cross-shore Classification System (BCCS)",
    "citations": 11,
    "doi": "10.2112/JCOASTRES-D-19A-00011.1",
    "year": 2019,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["C. Finkl", "C. Makowski"],
    "venue": "Journal of Coastal Research",
    "tldr": "Latitudinal and situational zonation of coastal catenary sequences observed from satellite images using the Biophysical Cross-shore Classification System (BCCS).",
    "abstract": ""
  },
  {
    "id": "IMPLICATIONS",
    "x": 0.1354,
    "y": -1.2912,
    "z": -1.2921,
    "title": "IMPLICATIONS AND GEOTECHNOLOGICAL PROPOSITIONS FOR THE YANOMAMI INDIGENOUS PEOPLES DUE TO ILLEGAL EXPLORATION OF GOLD MININGS",
    "citations": 0,
    "doi": "10.56083/rcv4n10-105",
    "year": 2024,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["Andr\u00e9 Luis Siqueira", "Tanielle Santos Amorim", "Marcelo Augusto Machado Vasconcelos", "P. C. S. Bittencourt", "Artur Vin\u00edcius Ferreira dos Santos", "P. A. Melo", "Kellem Cristina Prestes Melo", "Romulo Luiz Oliveira da Silva"],
    "venue": "Revista contemporânea",
    "tldr": "The 1988 Federal Constitution recognizes the territorial and cultural rights of the Yanomami indigenous peoples, guaranteeing the demarcation of their lands and respect for their traditional ways of life.",
    "abstract": ""
  },
  {
    "id": "Potential",
    "x": 0.2157,
    "y": -1.2197,
    "z": -1.4657,
    "title": "Potential Dam Breach Analysis and Flood Wave Risk Assessment Using HEC-RAS and Remote Sensing Data: A Multicriteria Approach",
    "citations": 80,
    "doi": "10.3390/W13030364",
    "year": 2021,
    "clusterId": 5,
    "color": "#FF7F00",
    "size": 0.2,
    "authors": ["E. Psomiadis", "Lefteris T. Tomanis", "Antonis Kavvadias", "K. Soulis", "Nikos Charizopoulos", "S. Michas"],
    "venue": "Water",
    "tldr": "Dam breach has disastrous consequences for the economy and human lives.",
    "abstract": ""
  },
  {
    "id": "Merging",
    "x": -1.1838,
    "y": 1.0213,
    "z": 1.2686,
    "title": "Merging and Dissipation of Intense Equatorial Plasma Bubbles With Large‐Scale Mid‐Latitude Low Electron Density Regions During the 23–24 April 2023 Geomagnetic Storm",
    "citations": 1,
    "doi": "10.1029/2025JA033744",
    "year": 2026,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Yuhao Zheng", "C. Xiong", "Xinyi Rang", "Shunzu Gao", "Xingxing Li"],
    "venue": "Journal of Geophysical Research - Space Physics",
    "tldr": "The extension of the post‐sunset equatorial plasma bubbles (EPBs) to mid‐latitudes during geomagnetic storms has been widely reported.",
    "abstract": ""
  },
  {
    "id": "The",
    "x": -1.2026,
    "y": 0.8733,
    "z": 1.1306,
    "title": "ID: astro-ph/0409568 | Year: 2004",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Resolving",
    "x": -1.5685,
    "y": 1.0455,
    "z": 1.1744,
    "title": "Resolving time-varying attitude jitter of an optical remote sensing satellite based on a time-frequency analysis.",
    "citations": 8,
    "doi": "10.1364/oe.392194",
    "year": 2020,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Z. Ye", "Yusheng Xu", "Shouzhu Zheng", "X. Tong", "Xiong Xu", "Sicong Liu", "Huan Xie", "Shijie Liu", "Chao Wei", "Uwe Stilla"],
    "venue": "Optics Express",
    "tldr": "This paper presents a novel processing framework for detecting, estimating, and investigating time-varying attitude jitter in long strips based on a time-frequency analysis with the input from either an attitude sensor or an optical imaging sensor.",
    "abstract": ""
  },
  {
    "id": "The",
    "x": -1.28,
    "y": 0.8787,
    "z": 1.3772,
    "title": "The Performance of the H.E.S.S.Target of Opportunity Alert System",
    "citations": 6,
    "doi": "10.1088/1742-6596/664/8/082002",
    "year": 2015,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["A. Balzer", "M. F\u00fcssling", "P. Hofverberg", "R. Parsons"],
    "venue": "Academic Conference",
    "tldr": "The High Energy Stereoscopic System (H.E.S.S.) is an array of five imaging atmospheric Cherenkov telescopes located in the Khomas Highland in Namibia.",
    "abstract": ""
  },
  {
    "id": "Wide-field",
    "x": -1.1759,
    "y": 0.8917,
    "z": 1.2394,
    "title": "Wide-field auroral imager onboard the Fengyun satellite",
    "citations": 49,
    "doi": "10.1038/s41377-019-0157-7",
    "year": 2019,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Xiaoxin Zhang", "Bo Chen", "Fei He", "K. Song", "Ling-Ping He", "Shijie Liu", "Quanfeng Guo", "Jiawei Li", "Xiao-Dong Wang", "Hong-Ji Zhang", "Hai-Feng Wang", "Zhengyue Han", "Liang Sun", "Pei-Jie Zhang", "S. Dai", "Guangxing Ding", "Li-Heng Chen", "Zhongsu Wang", "G. Shi", "Xin Zhang", "Chao Yu", "Zhongdong Yang", "P. Zhang", "Jin-song Wang"],
    "venue": "Light: Science & Applications",
    "tldr": "The newly launched Fengyun-3D (FY-3D) satellite carried a wide-field auroral imager (WAI) that was developed by Changchun Institute of Optics, Fine Mechanics and Physics, Chinese Academy of Sciences (CIOMP), which will provide a large field of view (FOV), high spatial resolution, and broadband ultraviolet images of the aurora and the ionosphere by imaging the N2 LBH bands of emissions.",
    "abstract": ""
  },
  {
    "id": "Gradient",
    "x": -1.2924,
    "y": 0.8829,
    "z": 1.3319,
    "title": "Gradient Path Labelling method and tracking method for calculation of solar differential rotation using coronal bright points",
    "citations": 5,
    "doi": "10.1016/J.ASCOM.2018.09.008",
    "year": 2018,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["I. Dorotovic", "A. Coelho", "J. Ryb\u00e1k", "A. Mora", "Rita Almeida Ribeiro"],
    "venue": "Astronomy and Computing",
    "tldr": "Abstract With new space missions, such as Solar Dynamics Observatory (SDO), solar images are being produced in unprecedented volumes.",
    "abstract": ""
  },
  {
    "id": "Performance",
    "x": -1.4955,
    "y": 0.762,
    "z": 1.4299,
    "title": "Performance Analysis of an Aerial Remote Sensing Platform Based on Real-Time Satellite Communication and Its Application in Natural Disaster Emergency Response",
    "citations": 8,
    "doi": "10.3390/rs16152866",
    "year": 2024,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Xiangli He", "Chong Xu", "Shengquan Tang", "Yuandong Huang", "Wenwen Qi", "Zikang Xiao"],
    "venue": "Remote Sensing",
    "tldr": "In this paper, we propose a design scheme for an aerial remote sensing platform based on real-time satellite communication.",
    "abstract": ""
  },
  {
    "id": "Centralized",
    "x": -1.2374,
    "y": 1.0653,
    "z": 1.0502,
    "title": "Centralized visual based navigation and control of a swarm of satellites for on-orbit servicing",
    "citations": 29,
    "doi": "10.1016/j.actaastro.2020.03.015",
    "year": 2020,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["M. Sabatini", "R. Volpe", "G. Palmerini"],
    "venue": "Acta Astronautica",
    "tldr": "Abstract In the framework of on-orbit proximity operations, small satellites represent an appealing solution in terms of costs, effectiveness and realization, but show intrinsic power, mass and computation limitations that could be overcome if cooperation among many spacecraft is considered.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -1.6138,
    "y": 0.9649,
    "z": 1.3174,
    "title": "A Doppler Effect Correction Method for APT Weather Satellite Image Reception",
    "citations": 5,
    "doi": "10.1109/ISPACS51563.2021.9651104",
    "year": 2021,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Shou-Sheu Lin", "Yan-Zhou Song"],
    "venue": "International Symposium on Intelligent Signal Processing and Communication Systems",
    "tldr": "In this paper, we propose a linear regression method to estimate the length of each line of the APT image, then, apply the interpolation to mitigate the Doppler shift and noise.",
    "abstract": ""
  },
  {
    "id": "Interpreting",
    "x": -1.0965,
    "y": 1.0688,
    "z": 1.2906,
    "title": "ID: astro-ph/0111466 | Year: 2001",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Multi-frame",
    "x": -1.5103,
    "y": 0.9229,
    "z": 1.3744,
    "title": "Multi-frame image restoration method for novel rotating synthetic aperture imaging system",
    "citations": 15,
    "doi": "10.1016/J.RINP.2021.103991",
    "year": 2021,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Xiyang Zhi", "Jiang Shikai", "Lei Zhang", "Hu Jianming", "Lijian Yu", "Xinhui Song", "J. Gong"],
    "venue": "Academic Conference",
    "tldr": "Abstract The novel rotating synthetic aperture (RSA) optical imaging system is an important development direction for future high-resolution optical remote sensing satellites in geostationary orbit.",
    "abstract": ""
  },
  {
    "id": "Towards",
    "x": -1.1776,
    "y": 0.9801,
    "z": 1.3082,
    "title": "ID: 2409.12327 | Year: 2024",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Intelligent",
    "x": -1.5388,
    "y": 0.9834,
    "z": 1.3405,
    "title": "Intelligent electro-optical systems for scalable space surveillance",
    "citations": 0,
    "doi": "10.1117/12.3094009",
    "year": 2026,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Y. Sechrest", "Joshua Maher", "L. Parker", "P. Wozniak", "Ava Moore", "Bram A. Schuijff", "J. M. Kirchner", "David M. Palmer"],
    "venue": "Defense + Security",
    "tldr": "We present progress in developing next generation real-time autonomous sensors for monitoring of the low Earth orbit (LEO) space object population.",
    "abstract": ""
  },
  {
    "id": "After",
    "x": -1.6235,
    "y": 0.8966,
    "z": 1.2991,
    "title": "After six months successful operations in low earth orbit: data processing system architecture and lessons learned from the LisR mission",
    "citations": 3,
    "doi": "10.23919/EDHPC59100.2023.10396501",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Sch\u00e4fer Konstantin", "Brunn Andreas", "Horch Clemens", "Bierdel Marius", "Jain Atin", "S. Frank"],
    "venue": "2023 European Data Handling & Data Processing Conference (EDHPC)",
    "tldr": "The LisR (Longwave Infrared Sensing demonstrator) mission was a successful technology demonstrator mission conducted on the Nanoracks Experimental Platform (NREP) outside the International Space Station (ISS).",
    "abstract": ""
  },
  {
    "id": "Radiation",
    "x": -1.5012,
    "y": 0.9934,
    "z": 1.3369,
    "title": "ID: 2112.08089 | Year: 2021",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Star",
    "x": -1.4166,
    "y": 0.9769,
    "z": 1.4003,
    "title": "Star Spots Extraction Method for Star Tracker in Dynamic Imaging Conditions",
    "citations": 0,
    "doi": "10.1109/ICAECCS68240.2025.11384770",
    "year": 2025,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Zoubida Mahi"],
    "venue": "2025 2nd International conference on Advances in Electronics, Control and Communication Systems (ICAECCS)",
    "tldr": "To this end, we developed a centroid extraction algorithm specifically adapted to star spots motion in the field of view.",
    "abstract": ""
  },
  {
    "id": "Precision",
    "x": -1.4595,
    "y": 1.0208,
    "z": 1.3386,
    "title": "Precision – A very-high resolution imager – Design through to manufacture",
    "citations": 0,
    "doi": "10.1117/12.2691125",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Kyriaki Minoglou", "Nikos Karafolas", "B. Cugny", "Knox S.a"],
    "venue": "International Conference on Space Optics",
    "tldr": "Precision is a very high resolution earth observation imager that delivers high quality and high area coverage for pan-sharpened imagery and has been developed by SSTL as part of a ESAs Incubed programme.",
    "abstract": ""
  },
  {
    "id": "Target-Driven",
    "x": -1.0577,
    "y": 0.8029,
    "z": 1.1978,
    "title": "Target-Driven Real-Time Geometric Processing Based on VLR Model for LuoJia3-02 Satellite",
    "citations": 3,
    "doi": "10.1109/LGRS.2024.3452793",
    "year": 2024,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Rongfan Dai", "Mi Wang", "Ru Chen", "Zhiqi Zhang"],
    "venue": "IEEE Geoscience and Remote Sensing Letters",
    "tldr": "The on-board processing systems of high-resolution optical satellites performing hotspot observations must be of high efficiency and high precision.",
    "abstract": ""
  },
  {
    "id": "Improved",
    "x": -1.2212,
    "y": 0.9825,
    "z": 1.2144,
    "title": "Improved Methodology for GOES-R ABI Data Resampling for Hot Spot Detection and Fire Monitoring",
    "citations": 0,
    "doi": "10.1109/TGRS.2025.3585061",
    "year": 2025,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Monica J. Cook", "F. Padula", "E. Bacon", "D. Pogorzala", "A. Pearlman", "Michael Pavolonis", "Daniel T. Lindsey"],
    "venue": "IEEE Transactions on Geoscience and Remote Sensing",
    "tldr": "The advanced baseline imager (ABI) on the Geostationary Operational Environmental Satellite (GOES)-R series includes both visible and infrared spectral bands that are used to locate and retrieve subpixel characteristics of fires.",
    "abstract": ""
  },
  {
    "id": "High-Resolution",
    "x": -1.2127,
    "y": 0.8502,
    "z": 1.3571,
    "title": "High-Resolution Imaging Capability of Large-Scale LEO Satellite Constellations",
    "citations": 0,
    "doi": "10.1109/ICC51166.2024.10622727",
    "year": 2024,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["Lhamo Dorje", "Xiaohua Li", "Yu Chen", "Nihal Poredi"],
    "venue": "ICC 2024 - IEEE International Conference on Communications",
    "tldr": "There has been a great interest in deploying large-scale Low-Earth Orbit (LEO) satellite constellations for wireless communications.",
    "abstract": ""
  },
  {
    "id": "Algorithms",
    "x": -1.4782,
    "y": 0.9498,
    "z": 1.3521,
    "title": "Algorithms for increasing the resource of ROM and RRD memory operation in deep space conditions",
    "citations": 0,
    "doi": "10.37791/2687-0649-2025-20-4-82-91",
    "year": 2025,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["M. Andrianov", "Konstantin Belousov", "R. A. Cherny"],
    "venue": "Journal Of Applied Informatics",
    "tldr": "In space-ground interferometry systems, in order to improve UV plane filling and the quality of synthesized images, antenna systems separated from each other are used, thus forming variable projections of the spacecraft – ground receiving station.",
    "abstract": ""
  },
  {
    "id": "2017",
    "x": -1.1935,
    "y": 0.9729,
    "z": 1.3537,
    "title": "2017 International Conference on Space Science and Communication",
    "citations": 0,
    "doi": "10.1088/1742-6596/852/1/011001",
    "year": 2017,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["W. Suparta", "M. Ismail", "Mardina Abdullah", "M. Faruque", "K. N. Maulud", "M. Nadzir", "M. Singh", "Jit Singh", "Z. Abidin"],
    "venue": "Academic Conference",
    "tldr": "Table of Content Preface 2017 International Conference on Space Science and Communication “Space Science for Sustainability” The present volume of the Journal of Physics: Conference Series represents contributions from participants of the 2017 International Conference on Space Science and Communication (IconSpace2017) held in Kuala Lumpur, Malaysia from May 3-5, 2017.",
    "abstract": ""
  },
  {
    "id": "Infrared",
    "x": -1.5059,
    "y": 0.984,
    "z": 1.2695,
    "title": "ID: 2210.04770 | Year: 2022",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "High-Accuracy",
    "x": -1.1521,
    "y": 1.0249,
    "z": 1.0904,
    "title": "High-Accuracy Star Tracker ASTRO XP",
    "citations": 0,
    "doi": "10.5270/esa-gnc-icatt-2023-056",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": ["U. Schmidt", "R. W\u00fcrl", "M. Griebel", "J\u00f6rg Reichardt", "Daniel Adolf", "Thomas K\u00fchn", "Steffen Kirschstein", "I. Steinbach"],
    "venue": "Papers of ESA GNC-ICATT 2023",
    "tldr": "Jena-Optronik GmbH, located in Jena/Germany, has profound experience in designing and  manufacturing star trackers since the early 80ties.",
    "abstract": ""
  },
  {
    "id": "Detailed",
    "x": -1.6169,
    "y": 0.9445,
    "z": 1.211,
    "title": "ID: 2106.01611 | Year: 2021",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 6,
    "color": "#00C0BF",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Correcting",
    "x": 0.7406,
    "y": 1.4848,
    "z": 1.0502,
    "title": "ID: 2211.06544 | Year: 2022",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Design",
    "x": 0.7144,
    "y": 1.2646,
    "z": 0.9448,
    "title": "Design and development of remote sensing image data production system for provincial satellite center",
    "citations": 0,
    "doi": "10.1117/12.2668150",
    "year": 2023,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["W. Feng", "Sanwu Xie", "Zengzeng Cao", "Gang Xu", "Hao Chen", "Lin\u2019ge Su", "Jiaqi Zhang"],
    "venue": "Fourth International Conference on Geoscience and Remote Sensing Mapping",
    "tldr": "With the development of remote sensing satellite technology, the richness and data level of satellite images are rising rapidly.",
    "abstract": ""
  },
  {
    "id": "Runway",
    "x": 0.5429,
    "y": 1.3472,
    "z": 0.6528,
    "title": "Runway detection in High Resolution remote sensing data",
    "citations": 19,
    "doi": "10.1109/ISPA.2015.7306053",
    "year": 2015,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Philip T. G. Jackson", "C. Nelson", "J. Schiefele", "B. Obara"],
    "venue": "International Symposium on Image and Signal Processing and Analysis",
    "tldr": "In this paper we establish a novel method for accurate and precise extraction of geometric polygons for an arbitrary number of runways in VHR remote sensing imagery.",
    "abstract": ""
  },
  {
    "id": "Hardware-Optimized",
    "x": 0.2352,
    "y": 1.366,
    "z": 0.9505,
    "title": "Hardware-Optimized Architecture of On-Board Registration for Remote-Sensing Images —Take SURF as an Example",
    "citations": 6,
    "doi": "10.1109/JSTARS.2024.3377663",
    "year": 2024,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Xin Du", "Cankun Yang", "Ruofei Zhong", "Qingyang Li", "Yuanhang Wang", "Zhaoming Huang", "Xianlin Liu"],
    "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
    "tldr": "On-board processing has become an inevitable choice for the development of remote-sensing satellites.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": 0.6351,
    "y": 1.3542,
    "z": 0.7093,
    "title": "An Automatic Approach of Road Regions Extraction from Satellite Images based on Connected Component Algorithm",
    "citations": 0,
    "doi": "10.21275/v5i6.21061603",
    "year": 2016,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["M. Shrivastava", "D. Bhalerao"],
    "venue": "Academic Conference",
    "tldr": ": Satellite images provide valuable information for a wide range of applications.",
    "abstract": ""
  },
  {
    "id": "Novel",
    "x": 0.4072,
    "y": 1.198,
    "z": 0.8021,
    "title": "Novel pseudo random key & cosine transformed chaotic maps based satellite image encryption",
    "citations": 35,
    "doi": "10.1007/s11042-021-10970-5",
    "year": 2021,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Atul Kumar", "M. Dua"],
    "venue": "Multimedia tools and applications",
    "tldr": "Image encryption converts the images into unrecognizable forms that seems like a white noise.",
    "abstract": ""
  },
  {
    "id": "pt_7_6",
    "x": 0.259,
    "y": 1.3701,
    "z": 0.91,
    "title": "“Hangtian Tsinghua-1” Micro-Satellite and Its Image Processing",
    "citations": 1,
    "doi": "10.11834/jrs.20010304",
    "year": 2001,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Dai Mi"],
    "venue": "National Remote Sensing Bulletin",
    "tldr": "In this paper, we introduce the research background and key technical parameters of “Hangtian Tsinghua_1” micro_satellite.",
    "abstract": ""
  },
  {
    "id": "Method",
    "x": 0.721,
    "y": 1.5015,
    "z": 1.0644,
    "title": "Method for constructing a network of urban roads using satellite images",
    "citations": 0,
    "doi": "10.1088/1757-899X/1047/1/012037",
    "year": 2021,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["E. M. Vikhtenko", "A. A. Tusikova"],
    "venue": "Academic Conference",
    "tldr": "An automatic method for recognizing the urban network of highways on high-resolution satellite images has been developed and implemented, based on the use of the Mask-RCNN convolutional neural network.",
    "abstract": ""
  },
  {
    "id": "Optimizing",
    "x": 0.3873,
    "y": 1.3712,
    "z": 1.0772,
    "title": "Optimizing Geospatial Data for ML/CV Applications: A Python-Based Approach to Streamlining Map Processing by Removing Irrelevant Areas",
    "citations": 2,
    "doi": "10.3390/app142411978",
    "year": 2024,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["David Kasperek", "Micha\u0142 Podpora"],
    "venue": "Applied Sciences",
    "tldr": "The method presented in this paper involves three basic steps: road segmentation (using the Shapely module) to facilitate handling high-resolution orthoimagery, and then a modified Region-of-Interest approach, i.e., removing irrelevant areas, with only roads remaining.",
    "abstract": ""
  },
  {
    "id": "Very",
    "x": 0.735,
    "y": 1.4619,
    "z": 1.1083,
    "title": "Very High Resolution Satellite Image Classification Using Fuzzy Rule-Based Systems",
    "citations": 70,
    "doi": "10.3390/a6040762",
    "year": 2013,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["S. Jabari", "Yun Zhang"],
    "venue": "Algorithms",
    "tldr": "The aim of this research is to present a detailed step-by-step method for classification of very high resolution urban satellite images (VHRSI) into specific classes such as road, building, vegetation, etc., using fuzzy logic.",
    "abstract": ""
  },
  {
    "id": "Comparative",
    "x": 0.2961,
    "y": 1.2834,
    "z": 0.9098,
    "title": "Comparative Analysis of BRISK and ORB Methods for Local Feature Detection in Satellite Imagery",
    "citations": 3,
    "doi": "10.18372/1990-5548.83.19879",
    "year": 2025,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Artem Riabko", "Vitalii Hrishnenko"],
    "venue": "Electronics and Control Systems",
    "tldr": "Binary local feature detection, which is very important for the satellite image processing of object recognition and image matching, was studied in this paper.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.6593,
    "y": 1.4874,
    "z": 0.86,
    "title": "A Preprocessing Method for Moving Vehicle Images Based on Satellite Images",
    "citations": 0,
    "doi": "10.1109/ICCECE65250.2025.10985452",
    "year": 2025,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["wenxin cai", "Jing Wang", "Haijun He", "Guanghao Liu", "Xiaosong Li", "Dudu Guo"],
    "venue": "2025 5th International Conference on Consumer Electronics and Computer Engineering (ICCECE)",
    "tldr": "In this paper, an image preprocessing and image enhancement method is proposed to improve the visibility of vehicle targets, reduce background interference, and provide support for subsequent vehicle detection and tracking tasks.",
    "abstract": ""
  },
  {
    "id": "Analysis",
    "x": 0.575,
    "y": 1.4734,
    "z": 0.8646,
    "title": "Analysis of JPEG2000 Compression Quality of Optical Satellite Images",
    "citations": 6,
    "doi": "10.1109/acctcs53867.2022.00107",
    "year": 2022,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Xia-Qiong Yu", "Jinxian Zhao", "Tao Zhu", "Q. Lan", "Lin Gao", "Lingzhi Fan"],
    "venue": "2022 2nd Asia-Pacific Conference on Communications Technology and Computer Science (ACCTCS)",
    "tldr": "Remote sensing satellite image compression processing technology is an important means to realize high-quality image and fast data transmission at the same time.",
    "abstract": ""
  },
  {
    "id": "Design",
    "x": 0.4971,
    "y": 1.3716,
    "z": 1.0463,
    "title": "Design and Development of Decorrelation Stretch Technique for Enhancing the Quality of Satellite Images with Improved MSE and UIQI in Comparison with Wiener Filter",
    "citations": 7,
    "doi": "10.1149/10701.13279ecst",
    "year": 2022,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["N. R", "S. Priya"],
    "venue": "ECS Transactions",
    "tldr": "Image enhancement is the process of increasing the quality of an image by enhancing certain features of an image and the resultant image is more suitable than the input image.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": 0.5834,
    "y": 1.4931,
    "z": 1.0784,
    "title": "An Enhanced Type II Fuzzy Set Algorithm for Satellite Images Contrast Improvement",
    "citations": 0,
    "doi": "10.32520/stmsi.v15i6.6474",
    "year": 2026,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["M. Al-Abaji", "Mohammed Hazim Alkawaz"],
    "venue": "SISTEMASI",
    "tldr": "Satellite images contain detailed information that is of great importance in the field of remote sensing.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.3913,
    "y": 1.0642,
    "z": 1.0742,
    "title": "A Histogram Equalization Algorithm about Second Generation Wavelet Integer Transform",
    "citations": 0,
    "doi": "10.2991/ICMMCT-16.2016.59",
    "year": 2016,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Jianye Peng", "Yi Zhang"],
    "venue": "Academic Conference",
    "tldr": "In view of the traditional processing defects of histogram image, this paper proposes a new histogram equalization algorithm about second generation wavelet integer transform.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 0.5735,
    "y": 1.445,
    "z": 1.0168,
    "title": "A New Structural Matching Method Based on Linear Features for High Resolution Satellite Images",
    "citations": 0,
    "doi": "10.29252/JGIT.6.4.1",
    "year": 2019,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Somayeh Yavari", "M. J. V. Zoej", "M. Sahebi", "M. Mokhtarzade"],
    "venue": "Journal of Geospatial Information Technology",
    "tldr": "So, in this paper, the automatic matching procedure is performed and assessed using a new structural linear feature-based matching method with no need to any initial information.",
    "abstract": ""
  },
  {
    "id": "Multichannel",
    "x": 0.5949,
    "y": 1.456,
    "z": 1.0063,
    "title": "Multichannel and Multispectral Image Restoration Employing Fuzzy Theory and Directional Techniques",
    "citations": 0,
    "doi": "10.5772/7062",
    "year": 2009,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["A. Rosales", "V. Ponomaryov"],
    "venue": "Academic Conference",
    "tldr": "Satellite, Radar, Medical, High Definition Television, Virtual Reality, Electron Microscopy, etc.",
    "abstract": ""
  },
  {
    "id": "Destriping",
    "x": 0.5222,
    "y": 1.4239,
    "z": 1.0906,
    "title": "Destriping methods for high resolution satellite multispectral remote sensing image based on GPU adaptive partitioning technology",
    "citations": 1,
    "doi": "10.1117/12.2325311",
    "year": 2018,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Xue Yang", "Feng Li", "Lei Xin", "Cheng Wang", "Xiaoyong Wang", "Xing Chang"],
    "venue": "Remote Sensing",
    "tldr": "The stripe noise is a key factor that affects imaging quality of satellite multi-hyperspectral remote sensing images, which also has a serious effect on the interpretation and information extraction of remote sensing images.",
    "abstract": ""
  },
  {
    "id": "Digital",
    "x": 0.6372,
    "y": 1.119,
    "z": 0.8097,
    "title": "Digital Image and Video Processing: Algorithms and Applications",
    "citations": 3,
    "doi": "10.52783/jes.1516",
    "year": 2024,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["K. S. Patil", "Satwinder Singh", "Aditya R Unnithan", "A. Maury"],
    "venue": "Journal of Electrical Systems",
    "tldr": "Many of the techniques that are used in digital image and video processing were developed in the 1960s at Bell Laboratories.",
    "abstract": ""
  },
  {
    "id": "Slope-Restricted",
    "x": 0.2332,
    "y": 1.2828,
    "z": 1.0098,
    "title": "Slope-Restricted Multi-Scale Feature Matching for Geostationary Satellite Remote Sensing Images",
    "citations": 10,
    "doi": "10.3390/rs9060576",
    "year": 2017,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["Dan Zeng", "Lidan Wu", "Boyang Chen", "Wei Shen"],
    "venue": "Remote Sensing",
    "tldr": "For geostationary meteorological satellite (GSMS) remote sensing image registration, high computational cost and matching error are the two main challenging problems.",
    "abstract": ""
  },
  {
    "id": "ALGORITHM",
    "x": 0.4823,
    "y": 1.2734,
    "z": 1.1471,
    "title": "ALGORITHM FOR CLOUD COVER DETECTION ON MOSAIC SATELLITE IMAGES WITH BRIGHTNESS EQUALIZATION",
    "citations": 0,
    "doi": "10.21667/978-5-7722-0428-3-110-114",
    "year": 2025,
    "clusterId": 7,
    "color": "#A65628",
    "size": 0.2,
    "authors": ["A. Soloviev", "V. Arkhipkin"],
    "venue": "Modern Technologies in Science and Education. MTSE-2025",
    "tldr": "This paper presents an algorithm for detecting clouds in satellite images.",
    "abstract": ""
  },
  {
    "id": "Hyperfield",
    "x": 1.0953,
    "y": -0.1745,
    "z": -0.3765,
    "title": "Hyperfield - Hyperspectral small satellites for improving life on Earth",
    "citations": 5,
    "doi": "10.1109/AERO55745.2023.10115806",
    "year": 2023,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["T. Tikka", "J. Makynen", "M. Shimoni"],
    "venue": "IEEE Aerospace Conference",
    "tldr": "This paper presents the first and second generations of the Hyperfield satellites.",
    "abstract": ""
  },
  {
    "id": "Geophysical",
    "x": 1.0759,
    "y": -0.3687,
    "z": -0.6327,
    "title": "Geophysical validation and long-term consistency between GOME-2/MetOp-A total ozone column and measurements from the sensors GOME/ERS-2, SCIAMACHY/ENVISAT and OMI/Aura",
    "citations": 40,
    "doi": "10.5194/AMT-5-2169-2012",
    "year": 2012,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["M. Koukouli", "D. Balis", "D. Loyola", "P. Valks", "W. Zimmer", "N. Hao", "J. Lambert", "M. Roozendael", "C. Lerot", "R. Spurr"],
    "venue": "Academic Conference",
    "tldr": "The main aim of the paper is to assess the consistency of five years of Global Ozone Monitoring Experiment-2/Metop-A [GOME-2] total ozone columns and the long-term total ozone satellite monitoring database already in existence through an extensive inter-comparison and validation exercise using as reference Brewer and Dobson ground-based measurements.",
    "abstract": ""
  },
  {
    "id": "Reconstructing",
    "x": 1.3957,
    "y": -0.2886,
    "z": -0.5735,
    "title": "Reconstructing Gap-Free Daily Remote Sensing Reflectance in the Marginal Seas Using the DINEOF Method",
    "citations": 2,
    "doi": "10.1109/JSTARS.2025.3563216",
    "year": 2025,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Shuyan Lang", "Yuxuan Jiang", "Shengqiang Wang", "Yongjun Jia", "Yi Zhang"],
    "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
    "tldr": "Ocean color remote sensing has provided extensive datasets of various bio-optical parameters, which are essential for studying marine biogeochemical processes and ecosystems.",
    "abstract": ""
  },
  {
    "id": "Impact",
    "x": 1.0957,
    "y": -0.213,
    "z": -0.4035,
    "title": "Impact of water vapor transfer on a Circum-Bohai-Sea heavy fog: Observation and numerical simulation",
    "citations": 25,
    "doi": "10.1016/J.ATMOSRES.2019.06.008",
    "year": 2019,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Meng Tian", "Bingui Wu", "H\u00e9l\u00e8ne Huang", "Hongsheng Zhang", "Wenyu Zhang", "Zhaoyu Wang"],
    "venue": "Atmospheric research",
    "tldr": "Abstract a wide-range winter frontal fog that happened over Circum-Bohai-Sea (CBS) on December 17–192,016 was observed using satellite cloud image inversion, surface, ocean buoy, and radiosonde data.",
    "abstract": ""
  },
  {
    "id": "Radiometric",
    "x": 1.178,
    "y": -0.4244,
    "z": -0.6654,
    "title": "Radiometric Evaluation of SNPP VIIRS Band M11 via Sub-Kilometer Intercomparison with Aqua MODIS Band 7 over Snowy Scenes",
    "citations": 4,
    "doi": "10.3390/rs10030413",
    "year": 2018,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Mike Chu", "Junqiang Sun", "Menghua Wang"],
    "venue": "Remote Sensing",
    "tldr": "A refined intersensor comparison study is carried out to evaluate the radiometric stability of the 2257 nm channel (M11) of the first Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the Suomi National Polar-orbiting Partnership (SNPP) satellite.",
    "abstract": ""
  },
  {
    "id": "Enhanced",
    "x": 0.9985,
    "y": -0.3002,
    "z": -0.5522,
    "title": "Enhanced MOPITT data coverage through cloud detection improvement",
    "citations": 0,
    "doi": "10.5194/AMT-2021-112",
    "year": 2021,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["H. Marey", "J. Drummond", "Dylan B. A. Jones", "H. Worden", "M. Deeter", "J. Gille", "D. Mao"],
    "venue": "Academic Conference",
    "tldr": "The Measurements of Pollution in the Troposphere (MOPITT) satellite instrument has been measuring global tropospheric carbon monoxide (CO) since March 2000, providing the longest nearly continuous record of CO from space.",
    "abstract": ""
  },
  {
    "id": "SST",
    "x": 1.2032,
    "y": 0.0336,
    "z": -0.4467,
    "title": "SST Comparison of AVHRR and MODIS Time Series in the Western Mediterranean Sea",
    "citations": 12,
    "doi": "10.3390/rs12142241",
    "year": 2020,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Mar\u00eda Jos\u00e9 L\u00f3pez Garc\u00eda"],
    "venue": "Remote Sensing",
    "tldr": "This paper presents a comparison of the monthly SST data derived from both sensors, AVHRR and MODIS, in a series of ten years (2000–2009) in the Western Mediterranean basins.",
    "abstract": ""
  },
  {
    "id": "Microphysical",
    "x": 1.2525,
    "y": -0.0188,
    "z": -0.4807,
    "title": "Microphysical, macrophysical, and radiative responses of subtropical marine clouds to aerosol injections",
    "citations": 37,
    "doi": "10.5194/acp-23-1345-2023",
    "year": 2023,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Je-Yun Chun", "R. Wood", "P. Blossey", "S. Doherty"],
    "venue": "Atmospheric Chemistry and Physics",
    "tldr": "Ship tracks in subtropical marine low clouds are simulated and investigated using large-eddy simulations.",
    "abstract": ""
  },
  {
    "id": "Assessing",
    "x": 1.0981,
    "y": -0.045,
    "z": -0.5705,
    "title": "Assessing Zooplankton Communities' Influence on Particulate Organic Carbon Concentration",
    "citations": 0,
    "doi": "10.1029/2026GL122225",
    "year": 2026,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Thelma Pana\u00efotis", "B. Cael"],
    "venue": "Geophysical Research Letters",
    "tldr": "Zooplankton play a key role in setting the particulate organic carbon (POC) distribution in the ocean, but this role remains poorly quantified on large scales due to the complexity of zooplankton ecosystems and the sparsity and variability of observations.",
    "abstract": ""
  },
  {
    "id": "On-orbit",
    "x": 1.1766,
    "y": -0.225,
    "z": -0.6456,
    "title": "On-orbit NOAA-20 VIIRS solar diffuser bidirectional reflectance distribution function and screen transmittance characterization using yaw manoeuvres and regular on-orbit SDSM data",
    "citations": 9,
    "doi": "10.1080/01431161.2020.1739353",
    "year": 2020,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["T. Choi", "X. Shao", "S. B\u0142o\u0144ski", "C. Cao"],
    "venue": "International Journal of Remote Sensing",
    "tldr": "ABSTRACT On-orbit radiometric calibration of the Visible Infrared Imaging Radiometer Suite (VIIRS) sensor onboard the National Oceanic and Atmospheric Administration’s (NOAA) NOAA-20 satellite is dependent on Solar Diffuser (SD) and Solar Diffuser Stability Monitor (SDSM) observations for the Reflective Solar Bands (RSBs).",
    "abstract": ""
  },
  {
    "id": "Improving",
    "x": 0.9685,
    "y": -0.3498,
    "z": -0.4367,
    "title": "Improving Chlorophyll-A Estimation From Sentinel-2 (MSI) in the Barents Sea Using Machine Learning",
    "citations": 16,
    "doi": "10.1109/JSTARS.2021.3074975",
    "year": 2021,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["M. Asim", "C. Brekke", "Arif Mahmood", "T. Eltoft", "M. Reigstad"],
    "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
    "tldr": "To accurately estimate Chl-a, we propose to use additional information on pigment content within the productive column by matching the depth-integrated Chl-a concentrations with the satellite data.",
    "abstract": ""
  },
  {
    "id": "Atmospheric",
    "x": 0.9997,
    "y": -0.0276,
    "z": -0.4414,
    "title": "Atmospheric correction of HJ1-A/B images and the effects on remote sensing monitoring of cyanobacteria bloom",
    "citations": 1,
    "doi": "10.5194/PIAHS-368-69-2015",
    "year": 2015,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Hongxu Ma", "Shenglian Guo", "Xingjun Hong", "Yanlai Zhou"],
    "venue": "Academic Conference",
    "tldr": "The HJ-1A/B satellite offers free images with high spatial and temporal resolution, which are effective for dynamically monitoring cyanobacteria blooms.",
    "abstract": ""
  },
  {
    "id": "Optical",
    "x": 0.7945,
    "y": -0.1719,
    "z": -0.5813,
    "title": "Optical system of high-precision greenhouse gas imaging spectrometer",
    "citations": 3,
    "doi": "10.1117/12.2324304",
    "year": 2018,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Q. Pan", "Wei-min Shen"],
    "venue": "Asia-Pacific Remote Sensing",
    "tldr": "The increase of atmospheric concentration of anthropogenic greenhouse gases(GHGs), primarily carbon dioxide(CO2) and methane(CH4), is concerned as a main cause of the global climate change.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 1.0149,
    "y": -0.3923,
    "z": -0.3292,
    "title": "A Remote-Sensing Method to Estimate Bulk Refractive Index of Suspended Particles from GOCI Satellite Measurements over Bohai Sea and Yellow Sea",
    "citations": 2,
    "doi": "10.3390/app10010023",
    "year": 2019,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["Deyong Sun", "Zunbin Ling", "Shengqiang Wang", "Z. Qiu", "Yu Huan", "Z. Mao", "Yijun He"],
    "venue": "Applied Sciences",
    "tldr": "The bulk refractive index (np) of suspended particles, an apparent measure of particulate refraction capability and yet an essential element of particulate compositions and optical properties, is a critical indicator that helps understand many biogeochemical processes and ecosystems in marine waters.",
    "abstract": ""
  },
  {
    "id": "MOD2SEA",
    "x": 1.3593,
    "y": -0.1942,
    "z": -0.7069,
    "title": "MOD2SEA: A Coupled Atmosphere-Hydro-Optical Model for the Retrieval of Chlorophyll-a from Remote Sensing Observations in Complex Turbid Waters",
    "citations": 28,
    "doi": "10.3390/RS8090722",
    "year": 2016,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["B. Arabi", "M. S. Salama", "M. Wernand", "W. Verhoef"],
    "venue": "Remote Sensing",
    "tldr": "An accurate estimation of the chlorophyll-a (Chla) concentration is crucial for water quality monitoring and is highly desired by various government agencies and environmental groups.",
    "abstract": ""
  },
  {
    "id": "Biophysical",
    "x": 1.1898,
    "y": 0.0291,
    "z": -0.4969,
    "title": "Biophysical Submesoscale Processes in the Wake of Hurricane Ivan: Simulations and Satellite Observations",
    "citations": 6,
    "doi": "10.3390/jmse7110378",
    "year": 2019,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["T. Smith", "J. Jolliff", "N. Walker", "S. Anderson"],
    "venue": "Journal of Marine Science and Engineering",
    "tldr": "Tropical cyclone induced phytoplankton productivity is examined using a tropical cyclone version of the Coupled Ocean/Atmosphere Mesoscale Prediction System (COAMPS®).",
    "abstract": ""
  },
  {
    "id": "Excess",
    "x": 1.1216,
    "y": -0.1156,
    "z": -0.837,
    "title": "Excess 210Po and nutrient recycling within the California coastal transition zone",
    "citations": 35,
    "doi": "10.1029/92JC01932",
    "year": 1993,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["D. Kadko"],
    "venue": "Oceanographic Literature Review",
    "tldr": "Profiles of [sup 210]Pb, [sup 210]Po, and nutrients were measured within a cold, chlorophyll-rich filament observed in satellite images off Point Arena, California.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": 1.356,
    "y": -0.2758,
    "z": -0.6751,
    "title": "A new space technology for ocean observation: the SMOS mission",
    "citations": 15,
    "doi": "10.3989/SCIMAR.03621.19K",
    "year": 2012,
    "clusterId": 8,
    "color": "#F781BF",
    "size": 0.2,
    "authors": ["J. Font", "J. Ballabrera\u2010Poy", "Adriano Camps", "I. Corbella", "N. Duffo", "I. Dur\u00e1n", "M. Emelianov", "L. Enrique", "P. Fern\u00e1ndez", "C. Gabarr\u00f3", "C. M. Gonz\u00e1lez", "V. Gonz\u00e1lez", "J. Gourrion", "S. Guimbard", "N. Hoareau", "A. Julia", "S. Kalaroni", "A. Konstantinidou", "A. Aretxabaleta", "Justino Mart\u00ednez", "J. Miranda", "A. Monerris", "Sergio Montero", "B. Mourre", "M. Pablos", "F. P\u00e9rez", "M. Piles", "M. Portabella", "R. Sabia", "J. Salvador", "M. Talone", "F. Torres", "A. Turiel", "M. Vall-llossera", "R. Villarino"],
    "venue": "Academic Conference",
    "tldr": "This paper introduces SMOS in the ocean remote sensing context, and summarizes the MIRAS principles of operation and the SMOS salinity retrieval approach.",
    "abstract": ""
  },
  {
    "id": "HyperDB",
    "x": -0.5006,
    "y": 0.6218,
    "z": -0.5823,
    "title": "HyperDB: A Hyperspectral Land Class Database Designed for an Image Processing System",
    "citations": 6,
    "doi": "10.1109/TST.2017.7830901",
    "year": 2017,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["Yizhou Fan"],
    "venue": "Academic Conference",
    "tldr": "In this paper, we present a hyperspectral database (HyperDB) designed to cooperate with an embedded hyperspectral image processing system developed by the authors.",
    "abstract": ""
  },
  {
    "id": "CalCROP21",
    "x": -0.7409,
    "y": 0.491,
    "z": -0.4826,
    "title": "ID: 2107.12499 | Year: 2021",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Crop",
    "x": -0.3897,
    "y": 0.8153,
    "z": -0.5036,
    "title": "Crop Classification Combining Object-Oriented Method and Random Forest Model Using Unmanned Aerial Vehicle (UAV) Multispectral Image",
    "citations": 26,
    "doi": "10.3390/agriculture14040548",
    "year": 2024,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["Hui Deng", "Wenjiang Zhang", "Xiaoqian Zheng", "Houxi Zhang"],
    "venue": "Agriculture",
    "tldr": "The accurate and timely identification of crops holds paramount significance for effective crop management and yield estimation.",
    "abstract": ""
  },
  {
    "id": "Deep",
    "x": -0.8045,
    "y": 0.7081,
    "z": -0.4187,
    "title": "Deep NMF and Autoencoder: A Comparative Analysis for Hyperspectral Unmixing Using Prisma Real Images",
    "citations": 4,
    "doi": "10.1109/IGARSS53475.2024.10642930",
    "year": 2024,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["Gaetano Settembre", "N. Buono", "Flavia Esposito", "Nicol\u00f2 Taggio"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "In this study, among models capable of performing linear spectral unmixing, we present a comparative analysis performed on real data acquired from the PRISMA (PRecursore IperSpettrale della Missione Applicativa) hyperspectral satellite between deep nonnegative matrix factorization and artificial neural network autoencoder based methods.",
    "abstract": ""
  },
  {
    "id": "On",
    "x": -0.2919,
    "y": 0.715,
    "z": -0.4441,
    "title": "On Parallelizing Geometrical PCA Approximation",
    "citations": 3,
    "doi": "10.1109/ROEDUNET.2019.8909644",
    "year": 2019,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["A. Machidon", "C. Ciobanu", "O. Machidon", "P. Ogrutan"],
    "venue": "International Conference on Networking in Education and Research",
    "tldr": "Remote sensing data has known an explosive growth in the past decade.",
    "abstract": ""
  },
  {
    "id": "From",
    "x": -0.4177,
    "y": 0.8175,
    "z": -0.3424,
    "title": "From Do-It-Yourself Design to Discovery: A Comprehensive Approach to Hyperspectral Imaging from Drones",
    "citations": 4,
    "doi": "10.3390/rs16173202",
    "year": 2024,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["Oliver K. Hasler", "H. L\u00f8v\u00e5s", "A. Oudijk", "T. Bryne", "T. Johansen"],
    "venue": "Remote Sensing",
    "tldr": "This paper presents an innovative, holistic, and comprehensive approach to drone-based imaging spectroscopy based on a small, cost-effective, and lightweight Unmanned Aerial Vehicle (UAV) payload intended for remote sensing applications.",
    "abstract": ""
  },
  {
    "id": "Remote",
    "x": -0.6651,
    "y": 0.4747,
    "z": -0.2199,
    "title": "Remote Sensing Using Unmanned Aerial Vehicles for Water Stress Detection: A Review Focusing on Specialty Crops",
    "citations": 48,
    "doi": "10.3390/drones9040241",
    "year": 2025,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["H. Sharma", "Harjot Sidhu", "Arnab Bhowmik"],
    "venue": "Drones",
    "tldr": "This review evaluates the use of unmanned aerial vehicles (UAVs) in detecting and managing water stress in specialty crops through thermal, multispectral, and hyperspectral imaging.",
    "abstract": ""
  },
  {
    "id": "Multi-resolution",
    "x": -0.7998,
    "y": 0.7012,
    "z": -0.4654,
    "title": "Multi-resolution Pyramid Enhanced Non-local Feature Extraction for Hyperspectral Classification",
    "citations": 6,
    "doi": "10.1109/jstars.2022.3189105",
    "year": 2022,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["Bing Tu", "Xiaolong Liao", "Qianming Li", "Chengle Zhou", "A. Plaza"],
    "venue": "IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing",
    "tldr": "Hyperspectral image (HSI) is applied to accurately distinguish ground objects in many fields, owing to its abundant structural and spectral information.",
    "abstract": ""
  },
  {
    "id": "Tighnari",
    "x": -0.3866,
    "y": 0.5156,
    "z": -0.3481,
    "title": "ID: 2501.02649 | Year: 2025",
    "citations": 0,
    "doi": "",
    "year": 2023,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": [],
    "venue": "Academic Conference",
    "tldr": "",
    "abstract": ""
  },
  {
    "id": "Semantic",
    "x": -0.6473,
    "y": 0.3506,
    "z": -0.2137,
    "title": "Semantic Segmentation of Crops via Hyperspectral PRISMA Satellite Images",
    "citations": 2,
    "doi": "10.5220/0012705700003696",
    "year": 2024,
    "clusterId": 9,
    "color": "#E6AB02",
    "size": 0.2,
    "authors": ["Manilo Monaco", "Angela Sileo", "Diana Orlandi", "M. Battagliere", "Laura Candela", "M. G. Cimino", "G. A. Vivaldi", "Vincenzo Giannico"],
    "venue": "International Conference on Geographical Information Systems Theory, Applications and Management",
    "tldr": ": Data from hyperspectral remote sensing are promising to extract and classify crop characteristics, because it provides accurate and continuous spectral signatures of crops.",
    "abstract": ""
  },
  {
    "id": "Temporally",
    "x": -1.6323,
    "y": -1.4531,
    "z": -0.2902,
    "title": "Temporally extrapolating object-based threshold for updating urban extents from nighttime light data",
    "citations": 0,
    "doi": "10.1109/IGARSS.2016.7729460",
    "year": 2016,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["Yanhua Xie", "Qihao Weng"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "This study proposed an object-based method to estimate the relationship of optimal thresholds in different The Defense Meteorological Satellite Program/Operational Linescan System (DMSP/OLS) nighttime light (NTL) images for the purpose of mapping large-scale urban dynamics.",
    "abstract": ""
  },
  {
    "id": "Praktykowa",
    "x": -1.6294,
    "y": -1.3583,
    "z": -0.8432,
    "title": "Praktykować media/Praktykować siebie… O doświadczaniu przestrzeni późnej nowoczesności",
    "citations": 0,
    "doi": "10.21697/zk.2021.8.01",
    "year": 2021,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["K. Banaszkiewicz"],
    "venue": "Załącznik kulturoznawczy",
    "tldr": "In advanced globalization, the digital code, computer, and Internet become tools of cultural change.",
    "abstract": ""
  },
  {
    "id": "ONLINE",
    "x": -1.6685,
    "y": -1.6404,
    "z": -0.4752,
    "title": "ONLINE MAPS AND CLOUD-SUPPORTED LOCATION-BASED SERVICES ACROSS A MANIFOLD OF DEVICES",
    "citations": 3,
    "doi": "10.5194/ISPRSANNALS-I-4-151-2012",
    "year": 2012,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["M. Kroepfl", "Daniel Buchmueller", "F. Leberl"],
    "venue": "Academic Conference",
    "tldr": "In this paper, we provide an example of a simple geospatial application making use of this model, which we will use to explain the basic steps necessary to deploy an application involving a web service hosting geospatial information and a client software consuming the web service through an API.",
    "abstract": ""
  },
  {
    "id": "Country-Scale",
    "x": -1.8107,
    "y": -1.5279,
    "z": -0.4448,
    "title": "Country-Scale Photogrammetry and True Orthorectification Using Very-High-Resolution (VHR) Multi-View Satellite Imagery",
    "citations": 2,
    "doi": "10.1109/IGARSS52108.2023.10281555",
    "year": 2023,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["Nicholas Maxwell", "John Papadakis", "A. Ilie", "Craig Stutts", "Joseph Bates", "B. L. Raskob"],
    "venue": "IEEE International Geoscience and Remote Sensing Symposium",
    "tldr": "This paper presents a fully automated system capable of processing country-scale archives of Very High Resolution (VHR) multi-view imagery.",
    "abstract": ""
  },
  {
    "id": "Urban",
    "x": -1.7066,
    "y": -1.321,
    "z": -0.324,
    "title": "Urban Impervious Surface Automatic Threshold Detection Model Derived From Multitemporal Landsat Images",
    "citations": 9,
    "doi": "10.1109/TGRS.2021.3089581",
    "year": 2022,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["Yuliang Wang", "Mingshi Li"],
    "venue": "IEEE Transactions on Geoscience and Remote Sensing",
    "tldr": "In this article, we proposed a novel UIS index and an improved particle swarm optimization (PSO)-based UIS automatic threshold selection model (UISAT) to overcome those shortages when detecting UIS derived from multitemporal Landsat images.",
    "abstract": ""
  },
  {
    "id": "The",
    "x": -1.846,
    "y": -1.2202,
    "z": -0.6412,
    "title": "The Production of Assets Inventory by using a 360-degree Camera Mobile Mapping System in Langkawi, Malaysia",
    "citations": 1,
    "doi": "10.1088/1755-1315/767/1/012012",
    "year": 2021,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["S. Abdullah", "K. N. Tahar", "M. F. A. Rashid", "M. A. Osoman", "F. Abdullah"],
    "venue": "Academic Conference",
    "tldr": "Asset management system is a crucial element of a utility project because it helps a company to inspect the asset inventory systematically.",
    "abstract": ""
  },
  {
    "id": "An",
    "x": -1.5197,
    "y": -1.6186,
    "z": -0.6776,
    "title": "An urban-rural Fringe extraction method based on Combined Urban-rural Fringe Index (CUFI)",
    "citations": 10,
    "doi": "10.1080/10106049.2024.2311211",
    "year": 2024,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["Hongrui Duan", "Fuguang Du", "Yajing Zhang", "Xiaojun Jiang", "Bowei Chen"],
    "venue": "Geocarto International",
    "tldr": "Abstract In this article, a multi-source data-based method for urban-rural fringe extraction is proposed to solve the problem of insufficiently accurate division of urban-rural fringe, which can conveniently and accurately realise the extraction of the area of urban-rural fringe.",
    "abstract": ""
  },
  {
    "id": "Shadow",
    "x": -1.7893,
    "y": -1.6293,
    "z": -0.3369,
    "title": "Shadow Buildings analysis for seismic damage assesment",
    "citations": 0,
    "doi": "10.1109/M2GARSS57310.2024.10537497",
    "year": 2024,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["S. Saadi", "Khadidja Abbes", "Baya Nait Amara"],
    "venue": "2024 IEEE Mediterranean and Middle-East Geoscience and Remote Sensing Symposium (M2GARSS)",
    "tldr": "After a natural disaster occurrence, such as earthquakes, the remote sensing often remains a substantial way to detect the extent of disaster.",
    "abstract": ""
  },
  {
    "id": "A",
    "x": -1.8539,
    "y": -1.3444,
    "z": -0.5653,
    "title": "A method for urban population density prediction at 30m resolution",
    "citations": 13,
    "doi": "10.1080/15230406.2019.1687014",
    "year": 2020,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["K. Balakrishnan"],
    "venue": "Academic Conference",
    "tldr": "ABSTRACT This paper proposes a new method for urban population density prediction at 30 m resolution.",
    "abstract": ""
  },
  {
    "id": "Variation",
    "x": -1.5872,
    "y": -1.3456,
    "z": -0.8475,
    "title": "Variation Characteristics of Building Height Types in the Vertical Urban Expansion Process",
    "citations": 2,
    "doi": "10.15244/pjoes/139742",
    "year": 2021,
    "clusterId": 10,
    "color": "#1F78B4",
    "size": 0.2,
    "authors": ["Peifeng Zhang", "Zheng Cheng", "Jianfeng Xu", "Yuning Dai", "Xiaolin Qi", "Ruigang Chen", "Xin Li", "Neng Zhang", "Zuo Li"],
    "venue": "Polish Journal of Environmental Studies",
    "tldr": "The evolution of building height types in three-dimensional (3D) space is important for urban planning and urban atmospheric environment.",
    "abstract": ""
  }
];

export const SEMANTIC_EDGES: SemanticEdge[] = [
  {
    "source": "Remote",
    "target": "Leveraging",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.817799985408783,
      1.5263999700546265,
      -1.7373000383377075
    ],
    "targetPos": [
      0.8726999759674072,
      1.5687999725341797,
      -1.687399983406067
    ],
    "similarity": 0.5559999942779541
  },
  {
    "source": "Remote",
    "target": "URBAN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.817799985408783,
      1.5263999700546265,
      -1.7373000383377075
    ],
    "targetPos": [
      0.8291000127792358,
      1.5972000360488892,
      -1.686400055885315
    ],
    "similarity": 0.5899999737739563
  },
  {
    "source": "Hybrid",
    "target": "Segmentation",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.6035000085830688,
      1.531599998474121,
      -1.4467999935150146
    ],
    "targetPos": [
      0.7696999907493591,
      1.604099988937378,
      -1.2888000011444092
    ],
    "similarity": 0.5699999928474426
  },
  {
    "source": "Hybrid",
    "target": "Toward",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.6035000085830688,
      1.531599998474121,
      -1.4467999935150146
    ],
    "targetPos": [
      0.49000000953674316,
      1.5147000551223755,
      -1.4467999935150146
    ],
    "similarity": 0.5709999799728394
  },
  {
    "source": "Collective",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8726000189781189,
      1.5077999830245972,
      -1.2929999828338623
    ],
    "targetPos": [
      0.7972000241279602,
      1.4947999715805054,
      -1.3710999488830566
    ],
    "similarity": 0.5910000205039978
  },
  {
    "source": "Collective",
    "target": "Injecting",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8726000189781189,
      1.5077999830245972,
      -1.2929999828338623
    ],
    "targetPos": [
      0.8242999911308289,
      1.4936000108718872,
      -1.325700044631958
    ],
    "similarity": 0.6809999942779541
  },
  {
    "source": "A",
    "target": "An",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.829800009727478,
      1.2373000383377075,
      -1.610700011253357
    ],
    "targetPos": [
      0.8644999861717224,
      1.215399980545044,
      -1.6075999736785889
    ],
    "similarity": 0.44200000166893005
  },
  {
    "source": "Injecting",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8242999911308289,
      1.4936000108718872,
      -1.325700044631958
    ],
    "targetPos": [
      0.7972000241279602,
      1.4947999715805054,
      -1.3710999488830566
    ],
    "similarity": 0.6460000276565552
  },
  {
    "source": "Automatic",
    "target": "Big",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7282999753952026,
      1.2513999938964844,
      -1.5318000316619873
    ],
    "targetPos": [
      0.7160999774932861,
      1.3372000455856323,
      -1.4957000017166138
    ],
    "similarity": 0.4090000092983246
  },
  {
    "source": "Automatic",
    "target": "An",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7282999753952026,
      1.2513999938964844,
      -1.5318000316619873
    ],
    "targetPos": [
      0.7472000122070312,
      1.441499948501587,
      -1.753499984741211
    ],
    "similarity": 0.453000009059906
  },
  {
    "source": "Domain",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.9639000296592712,
      1.5011999607086182,
      -1.3170000314712524
    ],
    "targetPos": [
      0.8507999777793884,
      1.5746999979019165,
      -1.3240000009536743
    ],
    "similarity": 0.47200000286102295
  },
  {
    "source": "Domain",
    "target": "Vessel",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.9639000296592712,
      1.5011999607086182,
      -1.3170000314712524
    ],
    "targetPos": [
      0.9508000016212463,
      1.4630999565124512,
      -1.4321000576019287
    ],
    "similarity": 0.5090000033378601
  },
  {
    "source": "RAG",
    "target": "Land",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5713000297546387,
      1.3056999444961548,
      -1.3845000267028809
    ],
    "targetPos": [
      0.5583999752998352,
      1.4336999654769897,
      -1.3854000568389893
    ],
    "similarity": 0.4059999883174896
  },
  {
    "source": "RAG",
    "target": "Deep",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5713000297546387,
      1.3056999444961548,
      -1.3845000267028809
    ],
    "targetPos": [
      0.6189000010490417,
      1.2419999837875366,
      -1.3020000457763672
    ],
    "similarity": 0.4440000057220459
  },
  {
    "source": "USAGE",
    "target": "Deep",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.885200023651123,
      1.6136000156402588,
      -1.6009999513626099
    ],
    "targetPos": [
      0.910099983215332,
      1.6512999534606934,
      -1.4890999794006348
    ],
    "similarity": 0.4819999933242798
  },
  {
    "source": "USAGE",
    "target": "UCWater",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.885200023651123,
      1.6136000156402588,
      -1.6009999513626099
    ],
    "targetPos": [
      0.8101999759674072,
      1.6026999950408936,
      -1.5845999717712402
    ],
    "similarity": 0.4959999918937683
  },
  {
    "source": "An",
    "target": "Deep-Learning-Based",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8644999861717224,
      1.215399980545044,
      -1.6075999736785889
    ],
    "targetPos": [
      0.8492000102996826,
      1.2282999753952026,
      -1.5405000448226929
    ],
    "similarity": 0.42899999022483826
  },
  {
    "source": "Optimizing",
    "target": "Layer-Sensitivity-Aware",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5511000156402588,
      1.3171000480651855,
      -1.2903000116348267
    ],
    "targetPos": [
      0.44850000739097595,
      1.4970999956130981,
      -1.3969000577926636
    ],
    "similarity": 0.5239999890327454
  },
  {
    "source": "Optimizing",
    "target": "Deep",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5511000156402588,
      1.3171000480651855,
      -1.2903000116348267
    ],
    "targetPos": [
      0.6189000010490417,
      1.2419999837875366,
      -1.3020000457763672
    ],
    "similarity": 0.5509999990463257
  },
  {
    "source": "GPROF-NN",
    "target": "Super-Resolution",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5457000136375427,
      1.5845999717712402,
      -1.5295000076293945
    ],
    "targetPos": [
      0.5568000078201294,
      1.5480999946594238,
      -1.4742000102996826
    ],
    "similarity": 0.5920000076293945
  },
  {
    "source": "GPROF-NN",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5457000136375427,
      1.5845999717712402,
      -1.5295000076293945
    ],
    "targetPos": [
      0.7972000241279602,
      1.4947999715805054,
      -1.3710999488830566
    ],
    "similarity": 0.6029999852180481
  },
  {
    "source": "Intelligent",
    "target": "Learning",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8338000178337097,
      1.2651000022888184,
      -1.4710999727249146
    ],
    "targetPos": [
      0.7457000017166138,
      1.4040000438690186,
      -1.5264999866485596
    ],
    "similarity": 0.46399998664855957
  },
  {
    "source": "Intelligent",
    "target": "Urban",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8338000178337097,
      1.2651000022888184,
      -1.4710999727249146
    ],
    "targetPos": [
      0.6499999761581421,
      1.4278000593185425,
      -1.3660999536514282
    ],
    "similarity": 0.6010000109672546
  },
  {
    "source": "Land",
    "target": "Compressive",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5583999752998352,
      1.4336999654769897,
      -1.3854000568389893
    ],
    "targetPos": [
      0.6428999900817871,
      1.486899971961975,
      -1.3246999979019165
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "Land",
    "target": "Hybrid",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5583999752998352,
      1.4336999654769897,
      -1.3854000568389893
    ],
    "targetPos": [
      0.6035000085830688,
      1.531599998474121,
      -1.4467999935150146
    ],
    "similarity": 0.5070000290870667
  },
  {
    "source": "A",
    "target": "Toward",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7369999885559082,
      1.6053999662399292,
      -1.573199987411499
    ],
    "targetPos": [
      0.49000000953674316,
      1.5147000551223755,
      -1.4467999935150146
    ],
    "similarity": 0.5189999938011169
  },
  {
    "source": "A",
    "target": "UCWater",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7369999885559082,
      1.6053999662399292,
      -1.573199987411499
    ],
    "targetPos": [
      0.8101999759674072,
      1.6026999950408936,
      -1.5845999717712402
    ],
    "similarity": 0.6200000047683716
  },
  {
    "source": "Segmentation",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7696999907493591,
      1.604099988937378,
      -1.2888000011444092
    ],
    "targetPos": [
      0.8507999777793884,
      1.5746999979019165,
      -1.3240000009536743
    ],
    "similarity": 0.5180000066757202
  },
  {
    "source": "UnCRtainTS",
    "target": "URBAN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8679999709129333,
      1.6240999698638916,
      -1.6755000352859497
    ],
    "targetPos": [
      0.8291000127792358,
      1.5972000360488892,
      -1.686400055885315
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "UnCRtainTS",
    "target": "Enhancing",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8679999709129333,
      1.6240999698638916,
      -1.6755000352859497
    ],
    "targetPos": [
      0.8913000226020813,
      1.5723999738693237,
      -1.6748000383377075
    ],
    "similarity": 0.5199999809265137
  },
  {
    "source": "Deep-Learning-Based",
    "target": "Intelligent",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8492000102996826,
      1.2282999753952026,
      -1.5405000448226929
    ],
    "targetPos": [
      0.8338000178337097,
      1.2651000022888184,
      -1.4710999727249146
    ],
    "similarity": 0.4580000042915344
  },
  {
    "source": "Urban",
    "target": "Super-Resolution",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.6499999761581421,
      1.4278000593185425,
      -1.3660999536514282
    ],
    "targetPos": [
      0.7361999750137329,
      1.4595999717712402,
      -1.353600025177002
    ],
    "similarity": 0.48100000619888306
  },
  {
    "source": "Leveraging",
    "target": "Enhancing",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8726999759674072,
      1.5687999725341797,
      -1.687399983406067
    ],
    "targetPos": [
      0.8913000226020813,
      1.5723999738693237,
      -1.6748000383377075
    ],
    "similarity": 0.6520000100135803
  },
  {
    "source": "Leveraging",
    "target": "URBAN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8726999759674072,
      1.5687999725341797,
      -1.687399983406067
    ],
    "targetPos": [
      0.8291000127792358,
      1.5972000360488892,
      -1.686400055885315
    ],
    "similarity": 0.6679999828338623
  },
  {
    "source": "Enhanced",
    "target": "Vessel",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.932200014591217,
      1.6521999835968018,
      -1.4580999612808228
    ],
    "targetPos": [
      0.9508000016212463,
      1.4630999565124512,
      -1.4321000576019287
    ],
    "similarity": 0.5040000081062317
  },
  {
    "source": "Enhanced",
    "target": "Deep",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.932200014591217,
      1.6521999835968018,
      -1.4580999612808228
    ],
    "targetPos": [
      0.910099983215332,
      1.6512999534606934,
      -1.4890999794006348
    ],
    "similarity": 0.5070000290870667
  },
  {
    "source": "UCWater",
    "target": "GPROF-NN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8101999759674072,
      1.6026999950408936,
      -1.5845999717712402
    ],
    "targetPos": [
      0.5457000136375427,
      1.5845999717712402,
      -1.5295000076293945
    ],
    "similarity": 0.503000020980835
  },
  {
    "source": "Layer-Sensitivity-Aware",
    "target": "Toward",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.44850000739097595,
      1.4970999956130981,
      -1.3969000577926636
    ],
    "targetPos": [
      0.49000000953674316,
      1.5147000551223755,
      -1.4467999935150146
    ],
    "similarity": 0.6079999804496765
  },
  {
    "source": "Layer-Sensitivity-Aware",
    "target": "Classification",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.44850000739097595,
      1.4970999956130981,
      -1.3969000577926636
    ],
    "targetPos": [
      0.45879998803138733,
      1.516800045967102,
      -1.3787000179290771
    ],
    "similarity": 0.6909999847412109
  },
  {
    "source": "APPLICATION",
    "target": "Segmentation",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8366000056266785,
      1.4739999771118164,
      -1.5738999843597412
    ],
    "targetPos": [
      0.7696999907493591,
      1.604099988937378,
      -1.2888000011444092
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "APPLICATION",
    "target": "Super-Resolution",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8366000056266785,
      1.4739999771118164,
      -1.5738999843597412
    ],
    "targetPos": [
      0.5568000078201294,
      1.5480999946594238,
      -1.4742000102996826
    ],
    "similarity": 0.5350000262260437
  },
  {
    "source": "Vessel",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.9508000016212463,
      1.4630999565124512,
      -1.4321000576019287
    ],
    "targetPos": [
      0.8507999777793884,
      1.5746999979019165,
      -1.3240000009536743
    ],
    "similarity": 0.5109999775886536
  },
  {
    "source": "Training-free",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.9035999774932861,
      1.4341000318527222,
      -1.340399980545044
    ],
    "targetPos": [
      0.8507999777793884,
      1.5746999979019165,
      -1.3240000009536743
    ],
    "similarity": 0.46799999475479126
  },
  {
    "source": "Training-free",
    "target": "Vessel",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.9035999774932861,
      1.4341000318527222,
      -1.340399980545044
    ],
    "targetPos": [
      0.9508000016212463,
      1.4630999565124512,
      -1.4321000576019287
    ],
    "similarity": 0.47600001096725464
  },
  {
    "source": "Comparative",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8708000183105469,
      1.6460000276565552,
      -1.3854999542236328
    ],
    "targetPos": [
      0.8507999777793884,
      1.5746999979019165,
      -1.3240000009536743
    ],
    "similarity": 0.5770000219345093
  },
  {
    "source": "Comparative",
    "target": "Deep",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8708000183105469,
      1.6460000276565552,
      -1.3854999542236328
    ],
    "targetPos": [
      0.910099983215332,
      1.6512999534606934,
      -1.4890999794006348
    ],
    "similarity": 0.5910000205039978
  },
  {
    "source": "Improvement",
    "target": "Injecting",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7124000191688538,
      1.3646999597549438,
      -1.2466000318527222
    ],
    "targetPos": [
      0.8242999911308289,
      1.4936000108718872,
      -1.325700044631958
    ],
    "similarity": 0.4569999873638153
  },
  {
    "source": "Improvement",
    "target": "Land",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7124000191688538,
      1.3646999597549438,
      -1.2466000318527222
    ],
    "targetPos": [
      0.5583999752998352,
      1.4336999654769897,
      -1.3854000568389893
    ],
    "similarity": 0.4580000042915344
  },
  {
    "source": "Classification",
    "target": "Modality-Aware",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.45879998803138733,
      1.516800045967102,
      -1.3787000179290771
    ],
    "targetPos": [
      0.5310999751091003,
      1.4943000078201294,
      -1.3315000534057617
    ],
    "similarity": 0.5899999737739563
  },
  {
    "source": "Toward",
    "target": "GPROF-NN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.49000000953674316,
      1.5147000551223755,
      -1.4467999935150146
    ],
    "targetPos": [
      0.5457000136375427,
      1.5845999717712402,
      -1.5295000076293945
    ],
    "similarity": 0.5870000123977661
  },
  {
    "source": "Para-YOLO",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8952999711036682,
      1.2781000137329102,
      -1.5276000499725342
    ],
    "targetPos": [
      0.7972000241279602,
      1.4947999715805054,
      -1.3710999488830566
    ],
    "similarity": 0.4050000011920929
  },
  {
    "source": "Para-YOLO",
    "target": "Enhancing",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8952999711036682,
      1.2781000137329102,
      -1.5276000499725342
    ],
    "targetPos": [
      0.8913000226020813,
      1.5723999738693237,
      -1.6748000383377075
    ],
    "similarity": 0.4129999876022339
  },
  {
    "source": "High-resolution",
    "target": "GPROF-NN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5896999835968018,
      1.5733000040054321,
      -1.3794000148773193
    ],
    "targetPos": [
      0.5457000136375427,
      1.5845999717712402,
      -1.5295000076293945
    ],
    "similarity": 0.5109999775886536
  },
  {
    "source": "High-resolution",
    "target": "Compressive",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5896999835968018,
      1.5733000040054321,
      -1.3794000148773193
    ],
    "targetPos": [
      0.6428999900817871,
      1.486899971961975,
      -1.3246999979019165
    ],
    "similarity": 0.5350000262260437
  },
  {
    "source": "A",
    "target": "Compressive",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8507999777793884,
      1.5746999979019165,
      -1.3240000009536743
    ],
    "targetPos": [
      0.6428999900817871,
      1.486899971961975,
      -1.3246999979019165
    ],
    "similarity": 0.5600000023841858
  },
  {
    "source": "A",
    "target": "URBAN",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7044000029563904,
      1.5033999681472778,
      -1.682800054550171
    ],
    "targetPos": [
      0.8291000127792358,
      1.5972000360488892,
      -1.686400055885315
    ],
    "similarity": 0.49799999594688416
  },
  {
    "source": "A",
    "target": "Hybrid",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7044000029563904,
      1.5033999681472778,
      -1.682800054550171
    ],
    "targetPos": [
      0.6035000085830688,
      1.531599998474121,
      -1.4467999935150146
    ],
    "similarity": 0.5090000033378601
  },
  {
    "source": "URBAN",
    "target": "Enhancing",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8291000127792358,
      1.5972000360488892,
      -1.686400055885315
    ],
    "targetPos": [
      0.8913000226020813,
      1.5723999738693237,
      -1.6748000383377075
    ],
    "similarity": 0.6819999814033508
  },
  {
    "source": "Modality-Aware",
    "target": "Compressive",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5310999751091003,
      1.4943000078201294,
      -1.3315000534057617
    ],
    "targetPos": [
      0.6428999900817871,
      1.486899971961975,
      -1.3246999979019165
    ],
    "similarity": 0.5889999866485596
  },
  {
    "source": "Super-Resolution",
    "target": "Toward",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.5568000078201294,
      1.5480999946594238,
      -1.4742000102996826
    ],
    "targetPos": [
      0.49000000953674316,
      1.5147000551223755,
      -1.4467999935150146
    ],
    "similarity": 0.5569999814033508
  },
  {
    "source": "Land",
    "target": "Intelligent",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7063999772071838,
      1.2145999670028687,
      -1.4565999507904053
    ],
    "targetPos": [
      0.8338000178337097,
      1.2651000022888184,
      -1.4710999727249146
    ],
    "similarity": 0.40799999237060547
  },
  {
    "source": "Land",
    "target": "Modality-Aware",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7063999772071838,
      1.2145999670028687,
      -1.4565999507904053
    ],
    "targetPos": [
      0.5310999751091003,
      1.4943000078201294,
      -1.3315000534057617
    ],
    "similarity": 0.42399999499320984
  },
  {
    "source": "Deep",
    "target": "Big",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.6189000010490417,
      1.2419999837875366,
      -1.3020000457763672
    ],
    "targetPos": [
      0.7160999774932861,
      1.3372000455856323,
      -1.4957000017166138
    ],
    "similarity": 0.5130000114440918
  },
  {
    "source": "Multilevel",
    "target": "Discovery",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.994700014591217,
      1.6309000253677368,
      -1.2893999814987183
    ],
    "targetPos": [
      0.9775999784469604,
      1.5995999574661255,
      -1.267899990081787
    ],
    "similarity": 0.5090000033378601
  },
  {
    "source": "Super-Resolution",
    "target": "Compressive",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7361999750137329,
      1.4595999717712402,
      -1.353600025177002
    ],
    "targetPos": [
      0.6428999900817871,
      1.486899971961975,
      -1.3246999979019165
    ],
    "similarity": 0.49900001287460327
  },
  {
    "source": "Super-Resolution",
    "target": "Super-Resolution",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7361999750137329,
      1.4595999717712402,
      -1.353600025177002
    ],
    "targetPos": [
      0.5568000078201294,
      1.5480999946594238,
      -1.4742000102996826
    ],
    "similarity": 0.5249999761581421
  },
  {
    "source": "Big",
    "target": "Learning",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7160999774932861,
      1.3372000455856323,
      -1.4957000017166138
    ],
    "targetPos": [
      0.7457000017166138,
      1.4040000438690186,
      -1.5264999866485596
    ],
    "similarity": 0.5339999794960022
  },
  {
    "source": "Learning",
    "target": "Enhancing",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.7457000017166138,
      1.4040000438690186,
      -1.5264999866485596
    ],
    "targetPos": [
      0.8913000226020813,
      1.5723999738693237,
      -1.6748000383377075
    ],
    "similarity": 0.5239999890327454
  },
  {
    "source": "Local",
    "target": "Segmentation",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8248999714851379,
      1.6009000539779663,
      -1.2436000108718872
    ],
    "targetPos": [
      0.7696999907493591,
      1.604099988937378,
      -1.2888000011444092
    ],
    "similarity": 0.48399999737739563
  },
  {
    "source": "Local",
    "target": "Comparative",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.8248999714851379,
      1.6009000539779663,
      -1.2436000108718872
    ],
    "targetPos": [
      0.8708000183105469,
      1.6460000276565552,
      -1.3854999542236328
    ],
    "similarity": 0.5099999904632568
  },
  {
    "source": "Large-scale",
    "target": "Super-Resolution",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.6103000044822693,
      1.37909996509552,
      -1.4846999645233154
    ],
    "targetPos": [
      0.5568000078201294,
      1.5480999946594238,
      -1.4742000102996826
    ],
    "similarity": 0.4059999883174896
  },
  {
    "source": "Large-scale",
    "target": "A",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.6103000044822693,
      1.37909996509552,
      -1.4846999645233154
    ],
    "targetPos": [
      0.7369999885559082,
      1.6053999662399292,
      -1.573199987411499
    ],
    "similarity": 0.40799999237060547
  },
  {
    "source": "Discovery",
    "target": "Comparative",
    "clusterId": 1,
    "color": "#E41A1C",
    "sourcePos": [
      0.9775999784469604,
      1.5995999574661255,
      -1.267899990081787
    ],
    "targetPos": [
      0.8708000183105469,
      1.6460000276565552,
      -1.3854999542236328
    ],
    "similarity": 0.4519999921321869
  },
  {
    "source": "B.SAR",
    "target": "Two",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.46799999475479126,
      -0.9656000137329102,
      0.890999972820282
    ],
    "targetPos": [
      -0.5105000138282776,
      -1.0401999950408936,
      0.964900016784668
    ],
    "similarity": 0.5350000262260437
  },
  {
    "source": "B.SAR",
    "target": "Volcanic",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.46799999475479126,
      -0.9656000137329102,
      0.890999972820282
    ],
    "targetPos": [
      -0.8346999883651733,
      -0.9984999895095825,
      1.0
    ],
    "similarity": 0.5740000009536743
  },
  {
    "source": "Repeat-pass",
    "target": "Multiparametric",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5507000088691711,
      -0.8141000270843506,
      1.1643999814987183
    ],
    "targetPos": [
      -0.510200023651123,
      -0.7782999873161316,
      1.1332999467849731
    ],
    "similarity": 0.5699999928474426
  },
  {
    "source": "Repeat-pass",
    "target": "Early",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5507000088691711,
      -0.8141000270843506,
      1.1643999814987183
    ],
    "targetPos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "similarity": 0.6230000257492065
  },
  {
    "source": "Hydrological",
    "target": "Integration",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5825999975204468,
      -0.8762999773025513,
      0.6690000295639038
    ],
    "targetPos": [
      -0.5663999915122986,
      -0.8475000262260437,
      0.6317999958992004
    ],
    "similarity": 0.5960000157356262
  },
  {
    "source": "Hydrological",
    "target": "Geophysical",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5825999975204468,
      -0.8762999773025513,
      0.6690000295639038
    ],
    "targetPos": [
      -0.5735999941825867,
      -0.9210000038146973,
      0.7315999865531921
    ],
    "similarity": 0.6710000038146973
  },
  {
    "source": "Seismic",
    "target": "Analysis",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5324000120162964,
      -0.7843999862670898,
      0.829800009727478
    ],
    "targetPos": [
      -0.5299999713897705,
      -0.7613000273704529,
      0.9567000269889832
    ],
    "similarity": 0.49000000953674316
  },
  {
    "source": "Seismic",
    "target": "Multiparametric",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5324000120162964,
      -0.7843999862670898,
      0.829800009727478
    ],
    "targetPos": [
      -0.510200023651123,
      -0.7782999873161316,
      1.1332999467849731
    ],
    "similarity": 0.49799999594688416
  },
  {
    "source": "Early",
    "target": "Multiparametric",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "targetPos": [
      -0.510200023651123,
      -0.7782999873161316,
      1.1332999467849731
    ],
    "similarity": 0.652999997138977
  },
  {
    "source": "Pre-eruption",
    "target": "Distributed",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.9047999978065491,
      -1.090999960899353,
      1.0855000019073486
    ],
    "targetPos": [
      -0.8626999855041504,
      -0.8259999752044678,
      0.9987999796867371
    ],
    "similarity": 0.5149999856948853
  },
  {
    "source": "Pre-eruption",
    "target": "Application",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.9047999978065491,
      -1.090999960899353,
      1.0855000019073486
    ],
    "targetPos": [
      -0.9047999978065491,
      -1.047700047492981,
      1.0504000186920166
    ],
    "similarity": 0.5630000233650208
  },
  {
    "source": "Two",
    "target": "Hydrological",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5105000138282776,
      -1.0401999950408936,
      0.964900016784668
    ],
    "targetPos": [
      -0.5825999975204468,
      -0.8762999773025513,
      0.6690000295639038
    ],
    "similarity": 0.5690000057220459
  },
  {
    "source": "Two",
    "target": "Volcanic",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5105000138282776,
      -1.0401999950408936,
      0.964900016784668
    ],
    "targetPos": [
      -0.8346999883651733,
      -0.9984999895095825,
      1.0
    ],
    "similarity": 0.6050000190734863
  },
  {
    "source": "Fine-Resolution",
    "target": "Tracking",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8256000280380249,
      -0.9480999708175659,
      1.073799967765808
    ],
    "targetPos": [
      -0.8008000254631042,
      -0.9972000122070312,
      1.0470000505447388
    ],
    "similarity": 0.4749999940395355
  },
  {
    "source": "Fine-Resolution",
    "target": "Deforestation",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8256000280380249,
      -0.9480999708175659,
      1.073799967765808
    ],
    "targetPos": [
      -0.9763000011444092,
      -0.894599974155426,
      1.0020999908447266
    ],
    "similarity": 0.5199999809265137
  },
  {
    "source": "AUTOMATIC",
    "target": "ICINGS",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5995000004768372,
      -0.8787000179290771,
      0.6865000128746033
    ],
    "targetPos": [
      -0.8278999924659729,
      -0.8898000121116638,
      0.781499981880188
    ],
    "similarity": 0.5350000262260437
  },
  {
    "source": "AUTOMATIC",
    "target": "Two",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5995000004768372,
      -0.8787000179290771,
      0.6865000128746033
    ],
    "targetPos": [
      -0.5105000138282776,
      -1.0401999950408936,
      0.964900016784668
    ],
    "similarity": 0.5509999990463257
  },
  {
    "source": "SBAS-InSAR",
    "target": "Analyzing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8938000202178955,
      -0.8313999772071838,
      0.8270000219345093
    ],
    "targetPos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "similarity": 0.5049999952316284
  },
  {
    "source": "SBAS-InSAR",
    "target": "ICINGS",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8938000202178955,
      -0.8313999772071838,
      0.8270000219345093
    ],
    "targetPos": [
      -0.8278999924659729,
      -0.8898000121116638,
      0.781499981880188
    ],
    "similarity": 0.5199999809265137
  },
  {
    "source": "Tracking",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8008000254631042,
      -0.9972000122070312,
      1.0470000505447388
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.45100000500679016
  },
  {
    "source": "SNOW",
    "target": "Tracing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.4731000065803528,
      -0.7960000038146973,
      1.131100058555603
    ],
    "targetPos": [
      -0.46209999918937683,
      -0.8578000068664551,
      1.0770000219345093
    ],
    "similarity": 0.5490000247955322
  },
  {
    "source": "SNOW",
    "target": "Early",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.4731000065803528,
      -0.7960000038146973,
      1.131100058555603
    ],
    "targetPos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "similarity": 0.5690000057220459
  },
  {
    "source": "Analyzing",
    "target": "ICINGS",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "targetPos": [
      -0.8278999924659729,
      -0.8898000121116638,
      0.781499981880188
    ],
    "similarity": 0.5889999866485596
  },
  {
    "source": "Analyzing",
    "target": "Distributed",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "targetPos": [
      -0.8626999855041504,
      -0.8259999752044678,
      0.9987999796867371
    ],
    "similarity": 0.625
  },
  {
    "source": "Time-series",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.7332000136375427,
      -0.9747999906539917,
      1.0994000434875488
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.5580000281333923
  },
  {
    "source": "Time-series",
    "target": "Hydrothermal",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.7332000136375427,
      -0.9747999906539917,
      1.0994000434875488
    ],
    "targetPos": [
      -0.6152999997138977,
      -0.9437999725341797,
      1.0896999835968018
    ],
    "similarity": 0.6100000143051147
  },
  {
    "source": "Tracing",
    "target": "Early",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.46209999918937683,
      -0.8578000068664551,
      1.0770000219345093
    ],
    "targetPos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "similarity": 0.5329999923706055
  },
  {
    "source": "Design",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.7750999927520752,
      -1.156499981880188,
      1.023800015449524
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.4320000112056732
  },
  {
    "source": "Design",
    "target": "IEEE",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.7750999927520752,
      -1.156499981880188,
      1.023800015449524
    ],
    "targetPos": [
      -0.6710000038146973,
      -0.9047999978065491,
      0.9010000228881836
    ],
    "similarity": 0.45500001311302185
  },
  {
    "source": "A",
    "target": "SNOW",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5090000033378601,
      -0.7394999861717224,
      1.1096999645233154
    ],
    "targetPos": [
      -0.4731000065803528,
      -0.7960000038146973,
      1.131100058555603
    ],
    "similarity": 0.47200000286102295
  },
  {
    "source": "A",
    "target": "Early",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5090000033378601,
      -0.7394999861717224,
      1.1096999645233154
    ],
    "targetPos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "similarity": 0.48500001430511475
  },
  {
    "source": "Geophysical",
    "target": "Integration",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5735999941825867,
      -0.9210000038146973,
      0.7315999865531921
    ],
    "targetPos": [
      -0.5663999915122986,
      -0.8475000262260437,
      0.6317999958992004
    ],
    "similarity": 0.5659999847412109
  },
  {
    "source": "Domino-style",
    "target": "Seismic",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.3603000044822693,
      -0.8070999979972839,
      0.8828999996185303
    ],
    "targetPos": [
      -0.5324000120162964,
      -0.7843999862670898,
      0.829800009727478
    ],
    "similarity": 0.42899999022483826
  },
  {
    "source": "Domino-style",
    "target": "Remote",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.3603000044822693,
      -0.8070999979972839,
      0.8828999996185303
    ],
    "targetPos": [
      -0.4041000008583069,
      -1.0582000017166138,
      0.8572999835014343
    ],
    "similarity": 0.43700000643730164
  },
  {
    "source": "An",
    "target": "Application",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.7336999773979187,
      -1.0543999671936035,
      0.9610000252723694
    ],
    "targetPos": [
      -0.9047999978065491,
      -1.047700047492981,
      1.0504000186920166
    ],
    "similarity": 0.4189999997615814
  },
  {
    "source": "Distributed",
    "target": "Volcanic",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8626999855041504,
      -0.8259999752044678,
      0.9987999796867371
    ],
    "targetPos": [
      -0.8346999883651733,
      -0.9984999895095825,
      1.0
    ],
    "similarity": 0.5759999752044678
  },
  {
    "source": "Qualitative",
    "target": "Analyzing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.9125999808311462,
      -1.0302000045776367,
      0.9430999755859375
    ],
    "targetPos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "similarity": 0.4580000042915344
  },
  {
    "source": "Remote",
    "target": "Seismic",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.4821000099182129,
      -0.8914999961853027,
      0.7656000256538391
    ],
    "targetPos": [
      -0.5324000120162964,
      -0.7843999862670898,
      0.829800009727478
    ],
    "similarity": 0.40299999713897705
  },
  {
    "source": "Ground",
    "target": "ICINGS",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.637499988079071,
      -0.9535999894142151,
      0.6208000183105469
    ],
    "targetPos": [
      -0.8278999924659729,
      -0.8898000121116638,
      0.781499981880188
    ],
    "similarity": 0.5149999856948853
  },
  {
    "source": "Ground",
    "target": "Integration",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.637499988079071,
      -0.9535999894142151,
      0.6208000183105469
    ],
    "targetPos": [
      -0.5663999915122986,
      -0.8475000262260437,
      0.6317999958992004
    ],
    "similarity": 0.5830000042915344
  },
  {
    "source": "ICINGS",
    "target": "Volcanic",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8278999924659729,
      -0.8898000121116638,
      0.781499981880188
    ],
    "targetPos": [
      -0.8346999883651733,
      -0.9984999895095825,
      1.0
    ],
    "similarity": 0.5590000152587891
  },
  {
    "source": "A",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.38769999146461487,
      -1.1279000043869019,
      0.9042999744415283
    ],
    "targetPos": [
      -0.524399995803833,
      -0.9887999892234802,
      0.9659000039100647
    ],
    "similarity": 0.44600000977516174
  },
  {
    "source": "A",
    "target": "Geophysical",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.38769999146461487,
      -1.1279000043869019,
      0.9042999744415283
    ],
    "targetPos": [
      -0.5735999941825867,
      -0.9210000038146973,
      0.7315999865531921
    ],
    "similarity": 0.4690000116825104
  },
  {
    "source": "IEEE",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6710000038146973,
      -0.9047999978065491,
      0.9010000228881836
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.5149999856948853
  },
  {
    "source": "IEEE",
    "target": "Analyzing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6710000038146973,
      -0.9047999978065491,
      0.9010000228881836
    ],
    "targetPos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "similarity": 0.5260000228881836
  },
  {
    "source": "Simulation",
    "target": "Early",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5156999826431274,
      -0.8966000080108643,
      1.0865000486373901
    ],
    "targetPos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "similarity": 0.503000020980835
  },
  {
    "source": "Simulation",
    "target": "Tracing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5156999826431274,
      -0.8966000080108643,
      1.0865000486373901
    ],
    "targetPos": [
      -0.46209999918937683,
      -0.8578000068664551,
      1.0770000219345093
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "Application",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.9047999978065491,
      -1.047700047492981,
      1.0504000186920166
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.5619999766349792
  },
  {
    "source": "Hydrothermal",
    "target": "Early",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6152999997138977,
      -0.9437999725341797,
      1.0896999835968018
    ],
    "targetPos": [
      -0.5709999799728394,
      -0.8657000064849854,
      1.155400037765503
    ],
    "similarity": 0.6010000109672546
  },
  {
    "source": "A",
    "target": "Integration",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6567000150680542,
      -1.1345000267028809,
      0.8920999765396118
    ],
    "targetPos": [
      -0.5663999915122986,
      -0.8475000262260437,
      0.6317999958992004
    ],
    "similarity": 0.46000000834465027
  },
  {
    "source": "A",
    "target": "Hydrothermal",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6567000150680542,
      -1.1345000267028809,
      0.8920999765396118
    ],
    "targetPos": [
      -0.6152999997138977,
      -0.9437999725341797,
      1.0896999835968018
    ],
    "similarity": 0.460999995470047
  },
  {
    "source": "Coastal",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8452000021934509,
      -0.9358999729156494,
      0.8669000267982483
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.5090000033378601
  },
  {
    "source": "Coastal",
    "target": "Analyzing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.8452000021934509,
      -0.9358999729156494,
      0.8669000267982483
    ],
    "targetPos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "similarity": 0.5680000185966492
  },
  {
    "source": "Deforestation",
    "target": "Analyzing",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.9763000011444092,
      -0.894599974155426,
      1.0020999908447266
    ],
    "targetPos": [
      -0.8919000029563904,
      -0.9417999982833862,
      0.9355000257492065
    ],
    "similarity": 0.4790000021457672
  },
  {
    "source": "Modeling",
    "target": "A",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6796000003814697,
      -0.9801999926567078,
      0.9549000263214111
    ],
    "targetPos": [
      -0.7063999772071838,
      -1.02839994430542,
      1.0339000225067139
    ],
    "similarity": 0.43700000643730164
  },
  {
    "source": "Modeling",
    "target": "IEEE",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.6796000003814697,
      -0.9801999926567078,
      0.9549000263214111
    ],
    "targetPos": [
      -0.6710000038146973,
      -0.9047999978065491,
      0.9010000228881836
    ],
    "similarity": 0.45100000500679016
  },
  {
    "source": "Analysis",
    "target": "IEEE",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5299999713897705,
      -0.7613000273704529,
      0.9567000269889832
    ],
    "targetPos": [
      -0.6710000038146973,
      -0.9047999978065491,
      0.9010000228881836
    ],
    "similarity": 0.503000020980835
  },
  {
    "source": "Analysis",
    "target": "SNOW",
    "clusterId": 2,
    "color": "#377EB8",
    "sourcePos": [
      -0.5299999713897705,
      -0.7613000273704529,
      0.9567000269889832
    ],
    "targetPos": [
      -0.4731000065803528,
      -0.7960000038146973,
      1.131100058555603
    ],
    "similarity": 0.5139999985694885
  },
  {
    "source": "Estimation",
    "target": "Uncertainty",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.0895999670028687,
      -0.6478999853134155,
      1.1693999767303467
    ],
    "targetPos": [
      0.9952999949455261,
      -0.7134000062942505,
      1.4412000179290771
    ],
    "similarity": 0.4320000112056732
  },
  {
    "source": "Estimation",
    "target": "Forest",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.0895999670028687,
      -0.6478999853134155,
      1.1693999767303467
    ],
    "targetPos": [
      1.0045000314712524,
      -0.7031000256538391,
      1.4462000131607056
    ],
    "similarity": 0.43299999833106995
  },
  {
    "source": "Flood",
    "target": "Research",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.3036999702453613,
      -0.546500027179718,
      1.2954000234603882
    ],
    "targetPos": [
      1.2871999740600586,
      -0.6333000063896179,
      1.2258000373840332
    ],
    "similarity": 0.4860000014305115
  },
  {
    "source": "Flood",
    "target": "High",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.3036999702453613,
      -0.546500027179718,
      1.2954000234603882
    ],
    "targetPos": [
      1.2961000204086304,
      -0.6499000191688538,
      1.2407000064849854
    ],
    "similarity": 0.5389999747276306
  },
  {
    "source": "Recent",
    "target": "Open-Source",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1888999938964844,
      -0.42320001125335693,
      1.3279000520706177
    ],
    "targetPos": [
      1.1449999809265137,
      -0.3993000090122223,
      1.4574999809265137
    ],
    "similarity": 0.46700000762939453
  },
  {
    "source": "Land",
    "target": "ANALISIS",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2178000211715698,
      -0.6976000070571899,
      1.1685999631881714
    ],
    "targetPos": [
      1.1964999437332153,
      -0.6583999991416931,
      1.2210999727249146
    ],
    "similarity": 0.4090000092983246
  },
  {
    "source": "High",
    "target": "Meteorological",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2961000204086304,
      -0.6499000191688538,
      1.2407000064849854
    ],
    "targetPos": [
      1.2407000064849854,
      -0.6700999736785889,
      1.229699969291687
    ],
    "similarity": 0.6169999837875366
  },
  {
    "source": "High",
    "target": "Research",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2961000204086304,
      -0.6499000191688538,
      1.2407000064849854
    ],
    "targetPos": [
      1.2871999740600586,
      -0.6333000063896179,
      1.2258000373840332
    ],
    "similarity": 0.6549999713897705
  },
  {
    "source": "Remote",
    "target": "Study",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2618000507354736,
      -0.3644999861717224,
      1.3770999908447266
    ],
    "targetPos": [
      1.2421000003814697,
      -0.3635999858379364,
      1.4297000169754028
    ],
    "similarity": 0.5680000185966492
  },
  {
    "source": "Remote",
    "target": "Pengolahan",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2618000507354736,
      -0.3644999861717224,
      1.3770999908447266
    ],
    "targetPos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "similarity": 0.6460000276565552
  },
  {
    "source": "Pengolahan",
    "target": "Study",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "targetPos": [
      1.2421000003814697,
      -0.3635999858379364,
      1.4297000169754028
    ],
    "similarity": 0.6050000190734863
  },
  {
    "source": "A",
    "target": "Research",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2510000467300415,
      -0.5873000025749207,
      1.2382999658584595
    ],
    "targetPos": [
      1.2871999740600586,
      -0.6333000063896179,
      1.2258000373840332
    ],
    "similarity": 0.42100000381469727
  },
  {
    "source": "A",
    "target": "Compositing",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2510000467300415,
      -0.5873000025749207,
      1.2382999658584595
    ],
    "targetPos": [
      1.2412999868392944,
      -0.4634999930858612,
      1.1431000232696533
    ],
    "similarity": 0.4449999928474426
  },
  {
    "source": "MODIS",
    "target": "Open-Source",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1231000423431396,
      -0.37310001254081726,
      1.486199975013733
    ],
    "targetPos": [
      1.1449999809265137,
      -0.3993000090122223,
      1.4574999809265137
    ],
    "similarity": 0.4650000035762787
  },
  {
    "source": "MODIS",
    "target": "Efficient",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1231000423431396,
      -0.37310001254081726,
      1.486199975013733
    ],
    "targetPos": [
      1.2223999500274658,
      -0.31380000710487366,
      1.4891999959945679
    ],
    "similarity": 0.515999972820282
  },
  {
    "source": "High",
    "target": "Satellite",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2727999687194824,
      -0.3133000135421753,
      1.155900001525879
    ],
    "targetPos": [
      1.2512999773025513,
      -0.25769999623298645,
      1.2906999588012695
    ],
    "similarity": 0.4480000138282776
  },
  {
    "source": "High",
    "target": "Evaluating",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2727999687194824,
      -0.3133000135421753,
      1.155900001525879
    ],
    "targetPos": [
      1.2421000003814697,
      -0.3009999990463257,
      1.0892000198364258
    ],
    "similarity": 0.47099998593330383
  },
  {
    "source": "Unsupervised",
    "target": "A",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9639000296592712,
      -0.6233999729156494,
      1.488700032234192
    ],
    "targetPos": [
      0.9420999884605408,
      -0.6448000073432922,
      1.422700047492981
    ],
    "similarity": 0.5759999752044678
  },
  {
    "source": "Unsupervised",
    "target": "Enhancing",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9639000296592712,
      -0.6233999729156494,
      1.488700032234192
    ],
    "targetPos": [
      1.0073000192642212,
      -0.4343000054359436,
      1.4752999544143677
    ],
    "similarity": 0.6520000100135803
  },
  {
    "source": "A",
    "target": "Uncertainty",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9420999884605408,
      -0.6448000073432922,
      1.422700047492981
    ],
    "targetPos": [
      0.9952999949455261,
      -0.7134000062942505,
      1.4412000179290771
    ],
    "similarity": 0.5210000276565552
  },
  {
    "source": "Comparison",
    "target": "Unsupervised",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.0579999685287476,
      -0.4691999852657318,
      1.4594000577926636
    ],
    "targetPos": [
      0.9639000296592712,
      -0.6233999729156494,
      1.488700032234192
    ],
    "similarity": 0.5040000081062317
  },
  {
    "source": "Comparison",
    "target": "Enhancing",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.0579999685287476,
      -0.4691999852657318,
      1.4594000577926636
    ],
    "targetPos": [
      1.0073000192642212,
      -0.4343000054359436,
      1.4752999544143677
    ],
    "similarity": 0.5419999957084656
  },
  {
    "source": "Prisma",
    "target": "Forest",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.968500018119812,
      -0.6807000041007996,
      1.4565999507904053
    ],
    "targetPos": [
      1.0045000314712524,
      -0.7031000256538391,
      1.4462000131607056
    ],
    "similarity": 0.5139999985694885
  },
  {
    "source": "Prisma",
    "target": "Unsupervised",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.968500018119812,
      -0.6807000041007996,
      1.4565999507904053
    ],
    "targetPos": [
      0.9639000296592712,
      -0.6233999729156494,
      1.488700032234192
    ],
    "similarity": 0.5400000214576721
  },
  {
    "source": "How",
    "target": "SIMULATION",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.8389000296592712,
      -0.46050000190734863,
      1.3759000301361084
    ],
    "targetPos": [
      0.9118000268936157,
      -0.4309000074863434,
      1.3264000415802002
    ],
    "similarity": 0.49799999594688416
  },
  {
    "source": "Discrimination",
    "target": "ANALISIS",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.0259000062942505,
      -0.5910999774932861,
      1.1943999528884888
    ],
    "targetPos": [
      1.1964999437332153,
      -0.6583999991416931,
      1.2210999727249146
    ],
    "similarity": 0.41999998688697815
  },
  {
    "source": "SIMULATION",
    "target": "Spatial",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9118000268936157,
      -0.4309000074863434,
      1.3264000415802002
    ],
    "targetPos": [
      0.9041000008583069,
      -0.476500004529953,
      1.3375999927520752
    ],
    "similarity": 0.5210000276565552
  },
  {
    "source": "SIMULATION",
    "target": "Enhancing",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9118000268936157,
      -0.4309000074863434,
      1.3264000415802002
    ],
    "targetPos": [
      1.0073000192642212,
      -0.4343000054359436,
      1.4752999544143677
    ],
    "similarity": 0.5830000042915344
  },
  {
    "source": "A",
    "target": "SIMULATION",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9695000052452087,
      -0.4027000069618225,
      1.1029000282287598
    ],
    "targetPos": [
      0.9118000268936157,
      -0.4309000074863434,
      1.3264000415802002
    ],
    "similarity": 0.40299999713897705
  },
  {
    "source": "Research",
    "target": "Meteorological",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2871999740600586,
      -0.6333000063896179,
      1.2258000373840332
    ],
    "targetPos": [
      1.2407000064849854,
      -0.6700999736785889,
      1.229699969291687
    ],
    "similarity": 0.5519999861717224
  },
  {
    "source": "Efficient",
    "target": "Open-Source",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2223999500274658,
      -0.31380000710487366,
      1.4891999959945679
    ],
    "targetPos": [
      1.1449999809265137,
      -0.3993000090122223,
      1.4574999809265137
    ],
    "similarity": 0.5320000052452087
  },
  {
    "source": "Efficient",
    "target": "Remote",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2223999500274658,
      -0.31380000710487366,
      1.4891999959945679
    ],
    "targetPos": [
      1.2618000507354736,
      -0.3644999861717224,
      1.3770999908447266
    ],
    "similarity": 0.5360000133514404
  },
  {
    "source": "Evaluating",
    "target": "Study",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2767000198364258,
      -0.288100004196167,
      1.4138000011444092
    ],
    "targetPos": [
      1.2421000003814697,
      -0.3635999858379364,
      1.4297000169754028
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "Evaluating",
    "target": "Pengolahan",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2767000198364258,
      -0.288100004196167,
      1.4138000011444092
    ],
    "targetPos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "similarity": 0.5070000290870667
  },
  {
    "source": "ANALISIS",
    "target": "High",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1964999437332153,
      -0.6583999991416931,
      1.2210999727249146
    ],
    "targetPos": [
      1.2961000204086304,
      -0.6499000191688538,
      1.2407000064849854
    ],
    "similarity": 0.4480000138282776
  },
  {
    "source": "ANALISIS",
    "target": "Meteorological",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1964999437332153,
      -0.6583999991416931,
      1.2210999727249146
    ],
    "targetPos": [
      1.2407000064849854,
      -0.6700999736785889,
      1.229699969291687
    ],
    "similarity": 0.4729999899864197
  },
  {
    "source": "Satellite",
    "target": "Pengolahan",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2512999773025513,
      -0.25769999623298645,
      1.2906999588012695
    ],
    "targetPos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "similarity": 0.5260000228881836
  },
  {
    "source": "Satellite",
    "target": "Remote",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2512999773025513,
      -0.25769999623298645,
      1.2906999588012695
    ],
    "targetPos": [
      1.2618000507354736,
      -0.3644999861717224,
      1.3770999908447266
    ],
    "similarity": 0.5600000023841858
  },
  {
    "source": "Using",
    "target": "Harnessing",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2782000303268433,
      -0.29820001125335693,
      1.4013999700546265
    ],
    "targetPos": [
      1.316100001335144,
      -0.33399999141693115,
      1.472599983215332
    ],
    "similarity": 0.40700000524520874
  },
  {
    "source": "Fusion",
    "target": "Satellite",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.285599946975708,
      -0.30070000886917114,
      1.2518999576568604
    ],
    "targetPos": [
      1.2512999773025513,
      -0.25769999623298645,
      1.2906999588012695
    ],
    "similarity": 0.4129999876022339
  },
  {
    "source": "Fusion",
    "target": "High",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.285599946975708,
      -0.30070000886917114,
      1.2518999576568604
    ],
    "targetPos": [
      1.2727999687194824,
      -0.3133000135421753,
      1.155900001525879
    ],
    "similarity": 0.4230000078678131
  },
  {
    "source": "Harnessing",
    "target": "Pengolahan",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.316100001335144,
      -0.33399999141693115,
      1.472599983215332
    ],
    "targetPos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "similarity": 0.515999972820282
  },
  {
    "source": "Uncertainty",
    "target": "Forest",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.9952999949455261,
      -0.7134000062942505,
      1.4412000179290771
    ],
    "targetPos": [
      1.0045000314712524,
      -0.7031000256538391,
      1.4462000131607056
    ],
    "similarity": 0.5979999899864197
  },
  {
    "source": "Comparison",
    "target": "Evaluating",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.3108999729156494,
      -0.2809000015258789,
      1.4528000354766846
    ],
    "targetPos": [
      1.2767000198364258,
      -0.288100004196167,
      1.4138000011444092
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "Comparison",
    "target": "Efficient",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.3108999729156494,
      -0.2809000015258789,
      1.4528000354766846
    ],
    "targetPos": [
      1.2223999500274658,
      -0.31380000710487366,
      1.4891999959945679
    ],
    "similarity": 0.5099999904632568
  },
  {
    "source": "Monitoring",
    "target": "Prisma",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.8216999769210815,
      -0.4952999949455261,
      1.271399974822998
    ],
    "targetPos": [
      0.968500018119812,
      -0.6807000041007996,
      1.4565999507904053
    ],
    "similarity": 0.41499999165534973
  },
  {
    "source": "Monitoring",
    "target": "SIMULATION",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      0.8216999769210815,
      -0.4952999949455261,
      1.271399974822998
    ],
    "targetPos": [
      0.9118000268936157,
      -0.4309000074863434,
      1.3264000415802002
    ],
    "similarity": 0.44600000977516174
  },
  {
    "source": "Land",
    "target": "Pengolahan",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1578999757766724,
      -0.5882999897003174,
      1.3517999649047852
    ],
    "targetPos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "similarity": 0.4860000014305115
  },
  {
    "source": "Land",
    "target": "Uncertainty",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1578999757766724,
      -0.5882999897003174,
      1.3517999649047852
    ],
    "targetPos": [
      0.9952999949455261,
      -0.7134000062942505,
      1.4412000179290771
    ],
    "similarity": 0.4950000047683716
  },
  {
    "source": "Fast",
    "target": "Flood",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.3555999994277954,
      -0.6032999753952026,
      1.2735999822616577
    ],
    "targetPos": [
      1.3036999702453613,
      -0.546500027179718,
      1.2954000234603882
    ],
    "similarity": 0.4090000092983246
  },
  {
    "source": "Fast",
    "target": "A",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.3555999994277954,
      -0.6032999753952026,
      1.2735999822616577
    ],
    "targetPos": [
      1.2510000467300415,
      -0.5873000025749207,
      1.2382999658584595
    ],
    "similarity": 0.41600000858306885
  },
  {
    "source": "Open-Source",
    "target": "Pengolahan",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.1449999809265137,
      -0.3993000090122223,
      1.4574999809265137
    ],
    "targetPos": [
      1.2728999853134155,
      -0.35760000348091125,
      1.4400999546051025
    ],
    "similarity": 0.527999997138977
  },
  {
    "source": "Compositing",
    "target": "Evaluating",
    "clusterId": 3,
    "color": "#4DAF4A",
    "sourcePos": [
      1.2412999868392944,
      -0.4634999930858612,
      1.1431000232696533
    ],
    "targetPos": [
      1.2767000198364258,
      -0.288100004196167,
      1.4138000011444092
    ],
    "similarity": 0.42899999022483826
  },
  {
    "source": "Mapping",
    "target": "Estudio",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.450200080871582,
      0.474700003862381,
      -0.4077000021934509
    ],
    "targetPos": [
      -2.255500078201294,
      0.31540000438690186,
      -0.451200008392334
    ],
    "similarity": 0.4490000009536743
  },
  {
    "source": "Mapping",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.450200080871582,
      0.474700003862381,
      -0.4077000021934509
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.4830000102519989
  },
  {
    "source": "Mangrove",
    "target": "Effects",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.6347999572753906,
      0.3449999988079071,
      -0.5576000213623047
    ],
    "targetPos": [
      -2.5564000606536865,
      0.22179999947547913,
      -0.3418999910354614
    ],
    "similarity": 0.5199999809265137
  },
  {
    "source": "Mangrove",
    "target": "Assessment",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.6347999572753906,
      0.3449999988079071,
      -0.5576000213623047
    ],
    "targetPos": [
      -2.6454999446868896,
      0.3555999994277954,
      -0.6262000203132629
    ],
    "similarity": 0.5569999814033508
  },
  {
    "source": "Deforestation",
    "target": "Mangrove",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5065999031066895,
      0.34459999203681946,
      -0.4733000099658966
    ],
    "targetPos": [
      -2.6347999572753906,
      0.3449999988079071,
      -0.5576000213623047
    ],
    "similarity": 0.5189999938011169
  },
  {
    "source": "Deforestation",
    "target": "Assessment",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5065999031066895,
      0.34459999203681946,
      -0.4733000099658966
    ],
    "targetPos": [
      -2.6454999446868896,
      0.3555999994277954,
      -0.6262000203132629
    ],
    "similarity": 0.5339999794960022
  },
  {
    "source": "Assessment",
    "target": "Urbanization",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.147900104522705,
      0.16349999606609344,
      -0.5210999846458435
    ],
    "targetPos": [
      -2.6456000804901123,
      0.3707999885082245,
      -0.5023000240325928
    ],
    "similarity": 0.4390000104904175
  },
  {
    "source": "Assessment",
    "target": "Interactive",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.147900104522705,
      0.16349999606609344,
      -0.5210999846458435
    ],
    "targetPos": [
      -2.2730000019073486,
      0.3084000051021576,
      -0.3458000123500824
    ],
    "similarity": 0.4880000054836273
  },
  {
    "source": "An",
    "target": "Evoluci",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.306299924850464,
      0.3797999918460846,
      -0.8335000276565552
    ],
    "targetPos": [
      -2.297499895095825,
      0.5289999842643738,
      -0.6704999804496765
    ],
    "similarity": 0.41100001335144043
  },
  {
    "source": "An",
    "target": "Impact",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.306299924850464,
      0.3797999918460846,
      -0.8335000276565552
    ],
    "targetPos": [
      -2.297800064086914,
      0.4999000132083893,
      -0.7236999869346619
    ],
    "similarity": 0.5260000228881836
  },
  {
    "source": "Transformations",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.2026000022888184,
      0.5120000243186951,
      -0.3555999994277954
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.4749999940395355
  },
  {
    "source": "Transformations",
    "target": "The",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.2026000022888184,
      0.5120000243186951,
      -0.3555999994277954
    ],
    "targetPos": [
      -2.2014000415802,
      0.5115000009536743,
      -0.57669997215271
    ],
    "similarity": 0.5320000052452087
  },
  {
    "source": "Environmental",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.4934000968933105,
      0.1737000048160553,
      -0.4318999946117401
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.4659999907016754
  },
  {
    "source": "Environmental",
    "target": "Effects",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.4934000968933105,
      0.1737000048160553,
      -0.4318999946117401
    ],
    "targetPos": [
      -2.5564000606536865,
      0.22179999947547913,
      -0.3418999910354614
    ],
    "similarity": 0.5109999775886536
  },
  {
    "source": "Effects",
    "target": "Avalia",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5564000606536865,
      0.22179999947547913,
      -0.3418999910354614
    ],
    "targetPos": [
      -2.5696001052856445,
      0.11550000309944153,
      -0.3589000105857849
    ],
    "similarity": 0.5400000214576721
  },
  {
    "source": "Effects",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5564000606536865,
      0.22179999947547913,
      -0.3418999910354614
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.5770000219345093
  },
  {
    "source": "The",
    "target": "GEOTECNOLOGIAS",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.2014000415802,
      0.5115000009536743,
      -0.57669997215271
    ],
    "targetPos": [
      -2.293600082397461,
      0.4277999997138977,
      -0.6607000231742859
    ],
    "similarity": 0.44999998807907104
  },
  {
    "source": "Forest",
    "target": "Urbanization",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "targetPos": [
      -2.6456000804901123,
      0.3707999885082245,
      -0.5023000240325928
    ],
    "similarity": 0.5690000057220459
  },
  {
    "source": "Pemetaan",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5246999263763428,
      0.09220000356435776,
      -0.3172999918460846
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.48399999737739563
  },
  {
    "source": "Pemetaan",
    "target": "Estudio",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5246999263763428,
      0.09220000356435776,
      -0.3172999918460846
    ],
    "targetPos": [
      -2.255500078201294,
      0.31540000438690186,
      -0.451200008392334
    ],
    "similarity": 0.5090000033378601
  },
  {
    "source": "Rock",
    "target": "Urbanization",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.6201000213623047,
      0.45159998536109924,
      -0.6014000177383423
    ],
    "targetPos": [
      -2.6456000804901123,
      0.3707999885082245,
      -0.5023000240325928
    ],
    "similarity": 0.4580000042915344
  },
  {
    "source": "Rock",
    "target": "Assessment",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.6201000213623047,
      0.45159998536109924,
      -0.6014000177383423
    ],
    "targetPos": [
      -2.6454999446868896,
      0.3555999994277954,
      -0.6262000203132629
    ],
    "similarity": 0.5099999904632568
  },
  {
    "source": "Estudio",
    "target": "GEOTECNOLOGIAS",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.255500078201294,
      0.31540000438690186,
      -0.451200008392334
    ],
    "targetPos": [
      -2.293600082397461,
      0.4277999997138977,
      -0.6607000231742859
    ],
    "similarity": 0.5550000071525574
  },
  {
    "source": "Estudio",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.255500078201294,
      0.31540000438690186,
      -0.451200008392334
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.5590000152587891
  },
  {
    "source": "Sandy",
    "target": "Environmental",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.4166998863220215,
      0.18520000576972961,
      -0.4198000133037567
    ],
    "targetPos": [
      -2.4934000968933105,
      0.1737000048160553,
      -0.4318999946117401
    ],
    "similarity": 0.44200000166893005
  },
  {
    "source": "Sandy",
    "target": "Effects",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.4166998863220215,
      0.18520000576972961,
      -0.4198000133037567
    ],
    "targetPos": [
      -2.5564000606536865,
      0.22179999947547913,
      -0.3418999910354614
    ],
    "similarity": 0.4449999928474426
  },
  {
    "source": "Environmental",
    "target": "Evoluci",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.2679998874664307,
      0.5130000114440918,
      -0.7339000105857849
    ],
    "targetPos": [
      -2.297499895095825,
      0.5289999842643738,
      -0.6704999804496765
    ],
    "similarity": 0.5450000166893005
  },
  {
    "source": "Environmental",
    "target": "Impact",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.2679998874664307,
      0.5130000114440918,
      -0.7339000105857849
    ],
    "targetPos": [
      -2.297800064086914,
      0.4999000132083893,
      -0.7236999869346619
    ],
    "similarity": 0.6909999847412109
  },
  {
    "source": "Impacts",
    "target": "Effects",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.6222000122070312,
      0.4837999939918518,
      -0.58160001039505
    ],
    "targetPos": [
      -2.5564000606536865,
      0.22179999947547913,
      -0.3418999910354614
    ],
    "similarity": 0.4970000088214874
  },
  {
    "source": "Impacts",
    "target": "Urbanization",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.6222000122070312,
      0.4837999939918518,
      -0.58160001039505
    ],
    "targetPos": [
      -2.6456000804901123,
      0.3707999885082245,
      -0.5023000240325928
    ],
    "similarity": 0.5199999809265137
  },
  {
    "source": "Avalia",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.5696001052856445,
      0.11550000309944153,
      -0.3589000105857849
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.5
  },
  {
    "source": "GEOTECNOLOGIAS",
    "target": "Evoluci",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.293600082397461,
      0.4277999997138977,
      -0.6607000231742859
    ],
    "targetPos": [
      -2.297499895095825,
      0.5289999842643738,
      -0.6704999804496765
    ],
    "similarity": 0.5630000233650208
  },
  {
    "source": "GEOTECNOLOGIAS",
    "target": "Impact",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.293600082397461,
      0.4277999997138977,
      -0.6607000231742859
    ],
    "targetPos": [
      -2.297800064086914,
      0.4999000132083893,
      -0.7236999869346619
    ],
    "similarity": 0.578000009059906
  },
  {
    "source": "Impact",
    "target": "Evoluci",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.297800064086914,
      0.4999000132083893,
      -0.7236999869346619
    ],
    "targetPos": [
      -2.297499895095825,
      0.5289999842643738,
      -0.6704999804496765
    ],
    "similarity": 0.6119999885559082
  },
  {
    "source": "Interactive",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.2730000019073486,
      0.3084000051021576,
      -0.3458000123500824
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.4860000014305115
  },
  {
    "source": "Land",
    "target": "Urbanization",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.700000047683716,
      0.31450000405311584,
      -0.46299999952316284
    ],
    "targetPos": [
      -2.6456000804901123,
      0.3707999885082245,
      -0.5023000240325928
    ],
    "similarity": 0.515999972820282
  },
  {
    "source": "Land",
    "target": "Forest",
    "clusterId": 4,
    "color": "#984EA3",
    "sourcePos": [
      -2.700000047683716,
      0.31450000405311584,
      -0.46299999952316284
    ],
    "targetPos": [
      -2.4263999462127686,
      0.41920000314712524,
      -0.3190000057220459
    ],
    "similarity": 0.531000018119812
  },
  {
    "source": "Photogrammetric",
    "target": "SPATIAL",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.1128000020980835,
      -1.6169999837875366,
      -1.5805000066757202
    ],
    "targetPos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "similarity": 0.5170000195503235
  },
  {
    "source": "Photogrammetric",
    "target": "Morphometric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.1128000020980835,
      -1.6169999837875366,
      -1.5805000066757202
    ],
    "targetPos": [
      0.01510000042617321,
      -1.5530999898910522,
      -1.5978000164031982
    ],
    "similarity": 0.5239999890327454
  },
  {
    "source": "Large-scale",
    "target": "Aperiodic",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.06560000032186508,
      -1.2879999876022339,
      -1.7367000579833984
    ],
    "targetPos": [
      -0.018400000408291817,
      -1.523900032043457,
      -1.3121000528335571
    ],
    "similarity": 0.4749999940395355
  },
  {
    "source": "Large-scale",
    "target": "GEOINFORMATION",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.06560000032186508,
      -1.2879999876022339,
      -1.7367000579833984
    ],
    "targetPos": [
      0.3089999854564667,
      -1.2598999738693237,
      -1.482800006866455
    ],
    "similarity": 0.4779999852180481
  },
  {
    "source": "GEOINFORMATION",
    "target": "Aperiodic",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.3089999854564667,
      -1.2598999738693237,
      -1.482800006866455
    ],
    "targetPos": [
      -0.018400000408291817,
      -1.523900032043457,
      -1.3121000528335571
    ],
    "similarity": 0.5419999957084656
  },
  {
    "source": "GEODESY",
    "target": "Potential",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.22660000622272491,
      -1.420799970626831,
      -1.4381999969482422
    ],
    "targetPos": [
      0.21570000052452087,
      -1.2196999788284302,
      -1.4657000303268433
    ],
    "similarity": 0.41999998688697815
  },
  {
    "source": "Hydro-morphodynamic",
    "target": "SPATIAL",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.24310000240802765,
      -1.54830002784729,
      -1.4814000129699707
    ],
    "targetPos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "Hydro-morphodynamic",
    "target": "Arazi",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.24310000240802765,
      -1.54830002784729,
      -1.4814000129699707
    ],
    "targetPos": [
      0.28760001063346863,
      -1.545799970626831,
      -1.4851000308990479
    ],
    "similarity": 0.5640000104904175
  },
  {
    "source": "Above",
    "target": "Large-scale",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.15539999306201935,
      -1.30239999294281,
      -1.582800030708313
    ],
    "targetPos": [
      0.06560000032186508,
      -1.2879999876022339,
      -1.7367000579833984
    ],
    "similarity": 0.453000009059906
  },
  {
    "source": "Above",
    "target": "Groundwater",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.15539999306201935,
      -1.30239999294281,
      -1.582800030708313
    ],
    "targetPos": [
      -0.19979999959468842,
      -1.4363000392913818,
      -1.5267000198364258
    ],
    "similarity": 0.47099998593330383
  },
  {
    "source": "SPATIAL",
    "target": "Detection",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "targetPos": [
      0.10019999742507935,
      -1.5555000305175781,
      -1.4984999895095825
    ],
    "similarity": 0.531000018119812
  },
  {
    "source": "SPATIAL",
    "target": "Arazi",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "targetPos": [
      0.28760001063346863,
      -1.545799970626831,
      -1.4851000308990479
    ],
    "similarity": 0.550000011920929
  },
  {
    "source": "To",
    "target": "Morphometric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.008899999782443047,
      -1.594499945640564,
      -1.514799952507019
    ],
    "targetPos": [
      0.01510000042617321,
      -1.5530999898910522,
      -1.5978000164031982
    ],
    "similarity": 0.42500001192092896
  },
  {
    "source": "To",
    "target": "Photogrammetric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.008899999782443047,
      -1.594499945640564,
      -1.514799952507019
    ],
    "targetPos": [
      0.1128000020980835,
      -1.6169999837875366,
      -1.5805000066757202
    ],
    "similarity": 0.4350000023841858
  },
  {
    "source": "Groundwater",
    "target": "Hydrological",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.19979999959468842,
      -1.4363000392913818,
      -1.5267000198364258
    ],
    "targetPos": [
      -0.26739999651908875,
      -1.3824000358581543,
      -1.4746999740600586
    ],
    "similarity": 0.49000000953674316
  },
  {
    "source": "Assessment",
    "target": "Morphometric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.07410000264644623,
      -1.3844000101089478,
      -1.8020000457763672
    ],
    "targetPos": [
      0.01510000042617321,
      -1.5530999898910522,
      -1.5978000164031982
    ],
    "similarity": 0.4860000014305115
  },
  {
    "source": "Assessment",
    "target": "Photogrammetric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.07410000264644623,
      -1.3844000101089478,
      -1.8020000457763672
    ],
    "targetPos": [
      0.1128000020980835,
      -1.6169999837875366,
      -1.5805000066757202
    ],
    "similarity": 0.5070000290870667
  },
  {
    "source": "Flood",
    "target": "SPATIAL",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.31769999861717224,
      -1.5472999811172485,
      -1.5047999620437622
    ],
    "targetPos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "similarity": 0.40700000524520874
  },
  {
    "source": "Flood",
    "target": "Arazi",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.31769999861717224,
      -1.5472999811172485,
      -1.5047999620437622
    ],
    "targetPos": [
      0.28760001063346863,
      -1.545799970626831,
      -1.4851000308990479
    ],
    "similarity": 0.5870000123977661
  },
  {
    "source": "Mapping",
    "target": "Detection",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.012000000104308128,
      -1.4773000478744507,
      -1.2661000490188599
    ],
    "targetPos": [
      0.10019999742507935,
      -1.5555000305175781,
      -1.4984999895095825
    ],
    "similarity": 0.4490000009536743
  },
  {
    "source": "Mapping",
    "target": "Aperiodic",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.012000000104308128,
      -1.4773000478744507,
      -1.2661000490188599
    ],
    "targetPos": [
      -0.018400000408291817,
      -1.523900032043457,
      -1.3121000528335571
    ],
    "similarity": 0.5170000195503235
  },
  {
    "source": "Utilization",
    "target": "Above",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.06780000030994415,
      -1.3454999923706055,
      -1.667099952697754
    ],
    "targetPos": [
      -0.15539999306201935,
      -1.30239999294281,
      -1.582800030708313
    ],
    "similarity": 0.4339999854564667
  },
  {
    "source": "Utilization",
    "target": "Mapping",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.06780000030994415,
      -1.3454999923706055,
      -1.667099952697754
    ],
    "targetPos": [
      0.012000000104308128,
      -1.4773000478744507,
      -1.2661000490188599
    ],
    "similarity": 0.4429999887943268
  },
  {
    "source": "Detection",
    "target": "Photogrammetric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.10019999742507935,
      -1.5555000305175781,
      -1.4984999895095825
    ],
    "targetPos": [
      0.1128000020980835,
      -1.6169999837875366,
      -1.5805000066757202
    ],
    "similarity": 0.5130000114440918
  },
  {
    "source": "Application",
    "target": "Morphometric",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.04270000010728836,
      -1.5002000331878662,
      -1.7034000158309937
    ],
    "targetPos": [
      0.01510000042617321,
      -1.5530999898910522,
      -1.5978000164031982
    ],
    "similarity": 0.4320000112056732
  },
  {
    "source": "Hydrological",
    "target": "pt_5_22",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.26739999651908875,
      -1.3824000358581543,
      -1.4746999740600586
    ],
    "targetPos": [
      -0.2199999988079071,
      -1.2831000089645386,
      -1.4114999771118164
    ],
    "similarity": 0.4880000054836273
  },
  {
    "source": "Morphometric",
    "target": "Detection",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.01510000042617321,
      -1.5530999898910522,
      -1.5978000164031982
    ],
    "targetPos": [
      0.10019999742507935,
      -1.5555000305175781,
      -1.4984999895095825
    ],
    "similarity": 0.4959999918937683
  },
  {
    "source": "METHODOLOGY",
    "target": "pt_5_22",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.12460000067949295,
      -1.3446999788284302,
      -1.5434999465942383
    ],
    "targetPos": [
      -0.2199999988079071,
      -1.2831000089645386,
      -1.4114999771118164
    ],
    "similarity": 0.46299999952316284
  },
  {
    "source": "METHODOLOGY",
    "target": "pt_5_25",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.12460000067949295,
      -1.3446999788284302,
      -1.5434999465942383
    ],
    "targetPos": [
      -0.22010000050067902,
      -1.312399983406067,
      -1.388100028038025
    ],
    "similarity": 0.5379999876022339
  },
  {
    "source": "pt_5_22",
    "target": "pt_5_25",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      -0.2199999988079071,
      -1.2831000089645386,
      -1.4114999771118164
    ],
    "targetPos": [
      -0.22010000050067902,
      -1.312399983406067,
      -1.388100028038025
    ],
    "similarity": 0.5260000228881836
  },
  {
    "source": "Monitoring",
    "target": "GEOINFORMATION",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.33340001106262207,
      -1.2374000549316406,
      -1.510200023651123
    ],
    "targetPos": [
      0.3089999854564667,
      -1.2598999738693237,
      -1.482800006866455
    ],
    "similarity": 0.460999995470047
  },
  {
    "source": "Latitudinal",
    "target": "IMPLICATIONS",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.243599995970726,
      -1.395900011062622,
      -1.3076000213623047
    ],
    "targetPos": [
      0.13539999723434448,
      -1.291200041770935,
      -1.292099952697754
    ],
    "similarity": 0.43299999833106995
  },
  {
    "source": "Latitudinal",
    "target": "SPATIAL",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.243599995970726,
      -1.395900011062622,
      -1.3076000213623047
    ],
    "targetPos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "similarity": 0.5009999871253967
  },
  {
    "source": "IMPLICATIONS",
    "target": "Detection",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.13539999723434448,
      -1.291200041770935,
      -1.292099952697754
    ],
    "targetPos": [
      0.10019999742507935,
      -1.5555000305175781,
      -1.4984999895095825
    ],
    "similarity": 0.4779999852180481
  },
  {
    "source": "IMPLICATIONS",
    "target": "SPATIAL",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.13539999723434448,
      -1.291200041770935,
      -1.292099952697754
    ],
    "targetPos": [
      0.1785999983549118,
      -1.5841000080108643,
      -1.5073000192642212
    ],
    "similarity": 0.4819999933242798
  },
  {
    "source": "Potential",
    "target": "Detection",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.21570000052452087,
      -1.2196999788284302,
      -1.4657000303268433
    ],
    "targetPos": [
      0.10019999742507935,
      -1.5555000305175781,
      -1.4984999895095825
    ],
    "similarity": 0.4449999928474426
  },
  {
    "source": "Potential",
    "target": "GEOINFORMATION",
    "clusterId": 5,
    "color": "#FF7F00",
    "sourcePos": [
      0.21570000052452087,
      -1.2196999788284302,
      -1.4657000303268433
    ],
    "targetPos": [
      0.3089999854564667,
      -1.2598999738693237,
      -1.482800006866455
    ],
    "similarity": 0.4690000116825104
  },
  {
    "source": "Merging",
    "target": "High-Resolution",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.1837999820709229,
      1.021299958229065,
      1.2685999870300293
    ],
    "targetPos": [
      -1.2127000093460083,
      0.8501999974250793,
      1.357100009918213
    ],
    "similarity": 0.49000000953674316
  },
  {
    "source": "Merging",
    "target": "Wide-field",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.1837999820709229,
      1.021299958229065,
      1.2685999870300293
    ],
    "targetPos": [
      -1.1758999824523926,
      0.891700029373169,
      1.239400029182434
    ],
    "similarity": 0.5590000152587891
  },
  {
    "source": "The",
    "target": "High-Resolution",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2026000022888184,
      0.8733000159263611,
      1.1305999755859375
    ],
    "targetPos": [
      -1.2127000093460083,
      0.8501999974250793,
      1.357100009918213
    ],
    "similarity": 0.42399999499320984
  },
  {
    "source": "The",
    "target": "2017",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2026000022888184,
      0.8733000159263611,
      1.1305999755859375
    ],
    "targetPos": [
      -1.19350004196167,
      0.9728999733924866,
      1.353700041770935
    ],
    "similarity": 0.4320000112056732
  },
  {
    "source": "Resolving",
    "target": "Precision",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.56850004196167,
      1.0455000400543213,
      1.174399971961975
    ],
    "targetPos": [
      -1.4594999551773071,
      1.020799994468689,
      1.3386000394821167
    ],
    "similarity": 0.5709999799728394
  },
  {
    "source": "Resolving",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.56850004196167,
      1.0455000400543213,
      1.174399971961975
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.5910000205039978
  },
  {
    "source": "The",
    "target": "Radiation",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2799999713897705,
      0.8787000179290771,
      1.3772000074386597
    ],
    "targetPos": [
      -1.5011999607086182,
      0.993399977684021,
      1.336899995803833
    ],
    "similarity": 0.5830000042915344
  },
  {
    "source": "Wide-field",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.1758999824523926,
      0.891700029373169,
      1.239400029182434
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.5550000071525574
  },
  {
    "source": "Gradient",
    "target": "Wide-field",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2924000024795532,
      0.8828999996185303,
      1.3319000005722046
    ],
    "targetPos": [
      -1.1758999824523926,
      0.891700029373169,
      1.239400029182434
    ],
    "similarity": 0.4569999873638153
  },
  {
    "source": "Gradient",
    "target": "The",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2924000024795532,
      0.8828999996185303,
      1.3319000005722046
    ],
    "targetPos": [
      -1.2799999713897705,
      0.8787000179290771,
      1.3772000074386597
    ],
    "similarity": 0.4620000123977661
  },
  {
    "source": "Centralized",
    "target": "2017",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2374000549316406,
      1.0652999877929688,
      1.0501999855041504
    ],
    "targetPos": [
      -1.19350004196167,
      0.9728999733924866,
      1.353700041770935
    ],
    "similarity": 0.4830000102519989
  },
  {
    "source": "Centralized",
    "target": "Wide-field",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2374000549316406,
      1.0652999877929688,
      1.0501999855041504
    ],
    "targetPos": [
      -1.1758999824523926,
      0.891700029373169,
      1.239400029182434
    ],
    "similarity": 0.503000020980835
  },
  {
    "source": "A",
    "target": "Intelligent",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.613800048828125,
      0.964900016784668,
      1.3173999786376953
    ],
    "targetPos": [
      -1.5388000011444092,
      0.9833999872207642,
      1.340499997138977
    ],
    "similarity": 0.4429999887943268
  },
  {
    "source": "A",
    "target": "Multi-frame",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.613800048828125,
      0.964900016784668,
      1.3173999786376953
    ],
    "targetPos": [
      -1.5103000402450562,
      0.9229000210762024,
      1.374400019645691
    ],
    "similarity": 0.47200000286102295
  },
  {
    "source": "Interpreting",
    "target": "Towards",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.096500039100647,
      1.0687999725341797,
      1.2905999422073364
    ],
    "targetPos": [
      -1.1776000261306763,
      0.9800999760627747,
      1.3082000017166138
    ],
    "similarity": 0.4000000059604645
  },
  {
    "source": "Interpreting",
    "target": "Merging",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.096500039100647,
      1.0687999725341797,
      1.2905999422073364
    ],
    "targetPos": [
      -1.1837999820709229,
      1.021299958229065,
      1.2685999870300293
    ],
    "similarity": 0.4339999854564667
  },
  {
    "source": "Multi-frame",
    "target": "Intelligent",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.5103000402450562,
      0.9229000210762024,
      1.374400019645691
    ],
    "targetPos": [
      -1.5388000011444092,
      0.9833999872207642,
      1.340499997138977
    ],
    "similarity": 0.4909999966621399
  },
  {
    "source": "Multi-frame",
    "target": "Algorithms",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.5103000402450562,
      0.9229000210762024,
      1.374400019645691
    ],
    "targetPos": [
      -1.4781999588012695,
      0.9498000144958496,
      1.3521000146865845
    ],
    "similarity": 0.5989999771118164
  },
  {
    "source": "Towards",
    "target": "Merging",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.1776000261306763,
      0.9800999760627747,
      1.3082000017166138
    ],
    "targetPos": [
      -1.1837999820709229,
      1.021299958229065,
      1.2685999870300293
    ],
    "similarity": 0.4490000009536743
  },
  {
    "source": "Intelligent",
    "target": "Radiation",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.5388000011444092,
      0.9833999872207642,
      1.340499997138977
    ],
    "targetPos": [
      -1.5011999607086182,
      0.993399977684021,
      1.336899995803833
    ],
    "similarity": 0.5820000171661377
  },
  {
    "source": "Intelligent",
    "target": "Algorithms",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.5388000011444092,
      0.9833999872207642,
      1.340499997138977
    ],
    "targetPos": [
      -1.4781999588012695,
      0.9498000144958496,
      1.3521000146865845
    ],
    "similarity": 0.6119999885559082
  },
  {
    "source": "After",
    "target": "Precision",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.6234999895095825,
      0.8966000080108643,
      1.2991000413894653
    ],
    "targetPos": [
      -1.4594999551773071,
      1.020799994468689,
      1.3386000394821167
    ],
    "similarity": 0.46299999952316284
  },
  {
    "source": "After",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.6234999895095825,
      0.8966000080108643,
      1.2991000413894653
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.48399999737739563
  },
  {
    "source": "Radiation",
    "target": "Algorithms",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.5011999607086182,
      0.993399977684021,
      1.336899995803833
    ],
    "targetPos": [
      -1.4781999588012695,
      0.9498000144958496,
      1.3521000146865845
    ],
    "similarity": 0.6100000143051147
  },
  {
    "source": "Radiation",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.5011999607086182,
      0.993399977684021,
      1.336899995803833
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.6620000004768372
  },
  {
    "source": "Star",
    "target": "Precision",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.416599988937378,
      0.9768999814987183,
      1.4003000259399414
    ],
    "targetPos": [
      -1.4594999551773071,
      1.020799994468689,
      1.3386000394821167
    ],
    "similarity": 0.5350000262260437
  },
  {
    "source": "Star",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.416599988937378,
      0.9768999814987183,
      1.4003000259399414
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.5569999814033508
  },
  {
    "source": "Precision",
    "target": "Radiation",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.4594999551773071,
      1.020799994468689,
      1.3386000394821167
    ],
    "targetPos": [
      -1.5011999607086182,
      0.993399977684021,
      1.336899995803833
    ],
    "similarity": 0.5960000157356262
  },
  {
    "source": "Precision",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.4594999551773071,
      1.020799994468689,
      1.3386000394821167
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.6980000138282776
  },
  {
    "source": "Improved",
    "target": "2017",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2211999893188477,
      0.9825000166893005,
      1.214400053024292
    ],
    "targetPos": [
      -1.19350004196167,
      0.9728999733924866,
      1.353700041770935
    ],
    "similarity": 0.4090000092983246
  },
  {
    "source": "Improved",
    "target": "Wide-field",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2211999893188477,
      0.9825000166893005,
      1.214400053024292
    ],
    "targetPos": [
      -1.1758999824523926,
      0.891700029373169,
      1.239400029182434
    ],
    "similarity": 0.5249999761581421
  },
  {
    "source": "High-Resolution",
    "target": "Wide-field",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.2127000093460083,
      0.8501999974250793,
      1.357100009918213
    ],
    "targetPos": [
      -1.1758999824523926,
      0.891700029373169,
      1.239400029182434
    ],
    "similarity": 0.5299999713897705
  },
  {
    "source": "Algorithms",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.4781999588012695,
      0.9498000144958496,
      1.3521000146865845
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.6340000033378601
  },
  {
    "source": "2017",
    "target": "Merging",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.19350004196167,
      0.9728999733924866,
      1.353700041770935
    ],
    "targetPos": [
      -1.1837999820709229,
      1.021299958229065,
      1.2685999870300293
    ],
    "similarity": 0.4729999899864197
  },
  {
    "source": "High-Accuracy",
    "target": "The",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.1520999670028687,
      1.024899959564209,
      1.090399980545044
    ],
    "targetPos": [
      -1.2026000022888184,
      0.8733000159263611,
      1.1305999755859375
    ],
    "similarity": 0.40700000524520874
  },
  {
    "source": "High-Accuracy",
    "target": "2017",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.1520999670028687,
      1.024899959564209,
      1.090399980545044
    ],
    "targetPos": [
      -1.19350004196167,
      0.9728999733924866,
      1.353700041770935
    ],
    "similarity": 0.453000009059906
  },
  {
    "source": "Detailed",
    "target": "Infrared",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.6168999671936035,
      0.9445000290870667,
      1.2109999656677246
    ],
    "targetPos": [
      -1.5059000253677368,
      0.984000027179718,
      1.2695000171661377
    ],
    "similarity": 0.44999998807907104
  },
  {
    "source": "Detailed",
    "target": "Resolving",
    "clusterId": 6,
    "color": "#00C0BF",
    "sourcePos": [
      -1.6168999671936035,
      0.9445000290870667,
      1.2109999656677246
    ],
    "targetPos": [
      -1.56850004196167,
      1.0455000400543213,
      1.174399971961975
    ],
    "similarity": 0.4659999907016754
  },
  {
    "source": "Correcting",
    "target": "Method",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.7405999898910522,
      1.4847999811172485,
      1.0501999855041504
    ],
    "targetPos": [
      0.7210000157356262,
      1.5015000104904175,
      1.0643999576568604
    ],
    "similarity": 0.47999998927116394
  },
  {
    "source": "Design",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.7143999934196472,
      1.2646000385284424,
      0.9448000192642212
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.4309999942779541
  },
  {
    "source": "Design",
    "target": "An",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.7143999934196472,
      1.2646000385284424,
      0.9448000192642212
    ],
    "targetPos": [
      0.6351000070571899,
      1.354200005531311,
      0.7092999815940857
    ],
    "similarity": 0.4959999918937683
  },
  {
    "source": "Runway",
    "target": "Design",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.542900025844574,
      1.3472000360488892,
      0.6528000235557556
    ],
    "targetPos": [
      0.49709999561309814,
      1.3716000318527222,
      1.0463000535964966
    ],
    "similarity": 0.40700000524520874
  },
  {
    "source": "Runway",
    "target": "An",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.542900025844574,
      1.3472000360488892,
      0.6528000235557556
    ],
    "targetPos": [
      0.6351000070571899,
      1.354200005531311,
      0.7092999815940857
    ],
    "similarity": 0.4129999876022339
  },
  {
    "source": "Hardware-Optimized",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.23520000278949738,
      1.3660000562667847,
      0.9505000114440918
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.5450000166893005
  },
  {
    "source": "Hardware-Optimized",
    "target": "pt_7_6",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.23520000278949738,
      1.3660000562667847,
      0.9505000114440918
    ],
    "targetPos": [
      0.2590000033378601,
      1.3701000213623047,
      0.9100000262260437
    ],
    "similarity": 0.6499999761581421
  },
  {
    "source": "An",
    "target": "Optimizing",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.6351000070571899,
      1.354200005531311,
      0.7092999815940857
    ],
    "targetPos": [
      0.3873000144958496,
      1.3711999654769897,
      1.0772000551223755
    ],
    "similarity": 0.4830000102519989
  },
  {
    "source": "pt_7_6",
    "target": "Slope-Restricted",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.2590000033378601,
      1.3701000213623047,
      0.9100000262260437
    ],
    "targetPos": [
      0.23319999873638153,
      1.2827999591827393,
      1.0097999572753906
    ],
    "similarity": 0.492000013589859
  },
  {
    "source": "Optimizing",
    "target": "Comparative",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.3873000144958496,
      1.3711999654769897,
      1.0772000551223755
    ],
    "targetPos": [
      0.296099990606308,
      1.283400058746338,
      0.9097999930381775
    ],
    "similarity": 0.4970000088214874
  },
  {
    "source": "Optimizing",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.3873000144958496,
      1.3711999654769897,
      1.0772000551223755
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.6269999742507935
  },
  {
    "source": "Very",
    "target": "ALGORITHM",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.7350000143051147,
      1.461899995803833,
      1.108299970626831
    ],
    "targetPos": [
      0.4823000133037567,
      1.2733999490737915,
      1.1470999717712402
    ],
    "similarity": 0.4180000126361847
  },
  {
    "source": "Comparative",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.296099990606308,
      1.283400058746338,
      0.9097999930381775
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.4699999988079071
  },
  {
    "source": "A",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.6593000292778015,
      1.4874000549316406,
      0.8600000143051147
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.42500001192092896
  },
  {
    "source": "A",
    "target": "An",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.6593000292778015,
      1.4874000549316406,
      0.8600000143051147
    ],
    "targetPos": [
      0.6351000070571899,
      1.354200005531311,
      0.7092999815940857
    ],
    "similarity": 0.4259999990463257
  },
  {
    "source": "Analysis",
    "target": "Multichannel",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.574999988079071,
      1.4733999967575073,
      0.8646000027656555
    ],
    "targetPos": [
      0.5949000120162964,
      1.4559999704360962,
      1.0062999725341797
    ],
    "similarity": 0.4779999852180481
  },
  {
    "source": "Analysis",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.574999988079071,
      1.4733999967575073,
      0.8646000027656555
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.5059999823570251
  },
  {
    "source": "Design",
    "target": "Optimizing",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.49709999561309814,
      1.3716000318527222,
      1.0463000535964966
    ],
    "targetPos": [
      0.3873000144958496,
      1.3711999654769897,
      1.0772000551223755
    ],
    "similarity": 0.4819999933242798
  },
  {
    "source": "An",
    "target": "Multichannel",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.5834000110626221,
      1.4931000471115112,
      1.0784000158309937
    ],
    "targetPos": [
      0.5949000120162964,
      1.4559999704360962,
      1.0062999725341797
    ],
    "similarity": 0.42100000381469727
  },
  {
    "source": "An",
    "target": "Analysis",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.5834000110626221,
      1.4931000471115112,
      1.0784000158309937
    ],
    "targetPos": [
      0.574999988079071,
      1.4733999967575073,
      0.8646000027656555
    ],
    "similarity": 0.4320000112056732
  },
  {
    "source": "A",
    "target": "Design",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.5734999775886536,
      1.4450000524520874,
      1.016800045967102
    ],
    "targetPos": [
      0.49709999561309814,
      1.3716000318527222,
      1.0463000535964966
    ],
    "similarity": 0.4050000011920929
  },
  {
    "source": "A",
    "target": "ALGORITHM",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.5734999775886536,
      1.4450000524520874,
      1.016800045967102
    ],
    "targetPos": [
      0.4823000133037567,
      1.2733999490737915,
      1.1470999717712402
    ],
    "similarity": 0.414000004529953
  },
  {
    "source": "Multichannel",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.5949000120162964,
      1.4559999704360962,
      1.0062999725341797
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.5460000038146973
  },
  {
    "source": "Slope-Restricted",
    "target": "Hardware-Optimized",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.23319999873638153,
      1.2827999591827393,
      1.0097999572753906
    ],
    "targetPos": [
      0.23520000278949738,
      1.3660000562667847,
      0.9505000114440918
    ],
    "similarity": 0.5360000133514404
  },
  {
    "source": "ALGORITHM",
    "target": "Hardware-Optimized",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.4823000133037567,
      1.2733999490737915,
      1.1470999717712402
    ],
    "targetPos": [
      0.23520000278949738,
      1.3660000562667847,
      0.9505000114440918
    ],
    "similarity": 0.421999990940094
  },
  {
    "source": "ALGORITHM",
    "target": "Destriping",
    "clusterId": 7,
    "color": "#A65628",
    "sourcePos": [
      0.4823000133037567,
      1.2733999490737915,
      1.1470999717712402
    ],
    "targetPos": [
      0.5221999883651733,
      1.4239000082015991,
      1.0906000137329102
    ],
    "similarity": 0.4440000057220459
  },
  {
    "source": "Hyperfield",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.0952999591827393,
      -0.1745000034570694,
      -0.3765000104904175
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.6069999933242798
  },
  {
    "source": "Hyperfield",
    "target": "Impact",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.0952999591827393,
      -0.1745000034570694,
      -0.3765000104904175
    ],
    "targetPos": [
      1.0957000255584717,
      -0.21299999952316284,
      -0.4034999907016754
    ],
    "similarity": 0.6830000281333923
  },
  {
    "source": "Impact",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.0957000255584717,
      -0.21299999952316284,
      -0.4034999907016754
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.6129999756813049
  },
  {
    "source": "SST",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.2031999826431274,
      0.03359999880194664,
      -0.44670000672340393
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.5199999809265137
  },
  {
    "source": "SST",
    "target": "Biophysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.2031999826431274,
      0.03359999880194664,
      -0.44670000672340393
    ],
    "targetPos": [
      1.1898000240325928,
      0.029100000858306885,
      -0.4968999922275543
    ],
    "similarity": 0.5960000157356262
  },
  {
    "source": "Assessing",
    "target": "Hyperfield",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.098099946975708,
      -0.04500000178813934,
      -0.5705000162124634
    ],
    "targetPos": [
      1.0952999591827393,
      -0.1745000034570694,
      -0.3765000104904175
    ],
    "similarity": 0.41999998688697815
  },
  {
    "source": "Assessing",
    "target": "SST",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.098099946975708,
      -0.04500000178813934,
      -0.5705000162124634
    ],
    "targetPos": [
      1.2031999826431274,
      0.03359999880194664,
      -0.44670000672340393
    ],
    "similarity": 0.4320000112056732
  },
  {
    "source": "Improving",
    "target": "Hyperfield",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      0.968500018119812,
      -0.3497999906539917,
      -0.4366999864578247
    ],
    "targetPos": [
      1.0952999591827393,
      -0.1745000034570694,
      -0.3765000104904175
    ],
    "similarity": 0.4429999887943268
  },
  {
    "source": "Improving",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      0.968500018119812,
      -0.3497999906539917,
      -0.4366999864578247
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.44600000977516174
  },
  {
    "source": "Atmospheric",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      0.9997000098228455,
      -0.02759999968111515,
      -0.4413999915122986
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.44699999690055847
  },
  {
    "source": "Atmospheric",
    "target": "Hyperfield",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      0.9997000098228455,
      -0.02759999968111515,
      -0.4413999915122986
    ],
    "targetPos": [
      1.0952999591827393,
      -0.1745000034570694,
      -0.3765000104904175
    ],
    "similarity": 0.49399998784065247
  },
  {
    "source": "Biophysical",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.1898000240325928,
      0.029100000858306885,
      -0.4968999922275543
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.5180000066757202
  },
  {
    "source": "Excess",
    "target": "Microphysical",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.1216000318527222,
      -0.11559999734163284,
      -0.8370000123977661
    ],
    "targetPos": [
      1.252500057220459,
      -0.018799999728798866,
      -0.48069998621940613
    ],
    "similarity": 0.421999990940094
  },
  {
    "source": "Excess",
    "target": "Hyperfield",
    "clusterId": 8,
    "color": "#F781BF",
    "sourcePos": [
      1.1216000318527222,
      -0.11559999734163284,
      -0.8370000123977661
    ],
    "targetPos": [
      1.0952999591827393,
      -0.1745000034570694,
      -0.3765000104904175
    ],
    "similarity": 0.4580000042915344
  },
  {
    "source": "HyperDB",
    "target": "Tighnari",
    "clusterId": 9,
    "color": "#E6AB02",
    "sourcePos": [
      -0.5005999803543091,
      0.6218000054359436,
      -0.5823000073432922
    ],
    "targetPos": [
      -0.38659998774528503,
      0.5156000256538391,
      -0.3481000065803528
    ],
    "similarity": 0.4410000145435333
  },
  {
    "source": "HyperDB",
    "target": "Remote",
    "clusterId": 9,
    "color": "#E6AB02",
    "sourcePos": [
      -0.5005999803543091,
      0.6218000054359436,
      -0.5823000073432922
    ],
    "targetPos": [
      -0.6650999784469604,
      0.474700003862381,
      -0.2198999971151352
    ],
    "similarity": 0.460999995470047
  },
  {
    "source": "Deep",
    "target": "Multi-resolution",
    "clusterId": 9,
    "color": "#E6AB02",
    "sourcePos": [
      -0.8044999837875366,
      0.7081000208854675,
      -0.4187000095844269
    ],
    "targetPos": [
      -0.7997999787330627,
      0.701200008392334,
      -0.46540001034736633
    ],
    "similarity": 0.5120000243186951
  },
  {
    "source": "Remote",
    "target": "Tighnari",
    "clusterId": 9,
    "color": "#E6AB02",
    "sourcePos": [
      -0.6650999784469604,
      0.474700003862381,
      -0.2198999971151352
    ],
    "targetPos": [
      -0.38659998774528503,
      0.5156000256538391,
      -0.3481000065803528
    ],
    "similarity": 0.5249999761581421
  },
  {
    "source": "Praktykowa",
    "target": "Shadow",
    "clusterId": 10,
    "color": "#1F78B4",
    "sourcePos": [
      -1.6294000148773193,
      -1.358299970626831,
      -0.8432000279426575
    ],
    "targetPos": [
      -1.7892999649047852,
      -1.6292999982833862,
      -0.336899995803833
    ],
    "similarity": 0.4650000035762787
  },
  {
    "source": "Praktykowa",
    "target": "Variation",
    "clusterId": 10,
    "color": "#1F78B4",
    "sourcePos": [
      -1.6294000148773193,
      -1.358299970626831,
      -0.8432000279426575
    ],
    "targetPos": [
      -1.5872000455856323,
      -1.3456000089645386,
      -0.8475000262260437
    ],
    "similarity": 0.5080000162124634
  },
  {
    "source": "ONLINE",
    "target": "Shadow",
    "clusterId": 10,
    "color": "#1F78B4",
    "sourcePos": [
      -1.6684999465942383,
      -1.6404000520706177,
      -0.47519999742507935
    ],
    "targetPos": [
      -1.7892999649047852,
      -1.6292999982833862,
      -0.336899995803833
    ],
    "similarity": 0.48899999260902405
  },
  {
    "source": "Country-Scale",
    "target": "Urban",
    "clusterId": 10,
    "color": "#1F78B4",
    "sourcePos": [
      -1.8107000589370728,
      -1.527899980545044,
      -0.4447999894618988
    ],
    "targetPos": [
      -1.7065999507904053,
      -1.3209999799728394,
      -0.3240000009536743
    ],
    "similarity": 0.4189999997615814
  },
  {
    "source": "Country-Scale",
    "target": "Shadow",
    "clusterId": 10,
    "color": "#1F78B4",
    "sourcePos": [
      -1.8107000589370728,
      -1.527899980545044,
      -0.4447999894618988
    ],
    "targetPos": [
      -1.7892999649047852,
      -1.6292999982833862,
      -0.336899995803833
    ],
    "similarity": 0.43799999356269836
  },
  {
    "source": "Urban",
    "target": "Shadow",
    "clusterId": 10,
    "color": "#1F78B4",
    "sourcePos": [
      -1.7065999507904053,
      -1.3209999799728394,
      -0.3240000009536743
    ],
    "targetPos": [
      -1.7892999649047852,
      -1.6292999982833862,
      -0.336899995803833
    ],
    "similarity": 0.46000000834465027
  }
];
