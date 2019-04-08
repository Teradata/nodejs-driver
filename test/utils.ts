export class Utils {
  public static BLOBLOC (aby: Uint8Array): LobValueFromLocator {
    return new LobValueFromLocator(aby, 'BLOB AS LOCATOR');
  }
  public static CLOBLOC (aby: string): LobValueFromLocator {
    return new LobValueFromLocator(aby, 'CLOB AS LOCATOR');
  }
  public static JSONLOC (aby: string): LobValueFromLocator {
    return new LobValueFromLocator(aby, 'JSON AS LOCATOR');
  }
  public static XMLLOC (aby: Uint8Array | string): LobValueFromLocator {
    return new LobValueFromLocator(aby, 'XML AS LOCATOR');
  }
}

export class LobValueFromLocator {
  private _oLobvalue: any;
  private _sDataType: string;
  constructor(oLobvalue: any, sDataType: string) {
    this._oLobvalue = oLobvalue;
    this._sDataType = sDataType;
  }
  get LobValue(): any {
    return this._oLobvalue;
  }
  get DataType(): string {
    return this._sDataType;
  }
}
