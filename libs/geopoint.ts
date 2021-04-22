class NCMBGeoPoint {
  public latitude: number = 0;
  public longitude: number = 0;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  toJSON(): NCMBGeoPointFormat {
    return {
      __type: 'GeoPoint',
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
}

export { NCMBGeoPoint }