class Operation {
  constructor(action, data) {
    this.action = action + ''
    this.data = data + ''
  }
}

export default class ConectorPlugin {
  static URL_PLUGIN_DEFAULT = 'http://localhost:8000'
  static OperationTicket = Operation
  static Constants = {
    ActionAccentedText: 'textoacentos',
    ActionQrAsImage: 'qrimage',
    ActionImage: 'image',
    ActionText: 'text',
    ActionCut: 'cut',
    ActionPulse: 'pulse',
    ActionCutPartial: 'cutpartial',
    ActionJustification: 'setJustification',
    ActionTextSize: 'setTextSize',
    ActionFont: 'setFont',
    ActionEmphasize: 'setEmphasis',
    ActionFeed: 'feed',
    ActionQr: 'qrCode',
    AlignmentCenter: 'center',
    AlignmentRight: 'right',
    AlignmentLeft: 'left',
    FontA: 'A',
    FontB: 'B',
    FontC: 'C',
    ActionBarcode128: 'barcode128',
    ActionBarcode39: 'barcode39',
    ActionBarcode93: 'barcode93',
    ActionBarcodeItf: 'barcodeitf',
    ActionBarcodeJan13: 'barcodejan13',
    ActionBarcodeJan8: 'barcodejan8',
    ActionBarcodeTextAbove: 'barcodetextabove',
    ActionBarcodeTextBelow: 'barcodetextbelow',
    ActionBarcodeTextNone: 'barcodetextnone',
    ActionBarcodeUPCA: 'barcodeUPCA',
    ActionBarcodeUPCE: 'barcodeUPCE',
    ActionImageLocal: 'imagelocal',
  }

  constructor(route) {
    if (!route) route = ConectorPlugin.URL_PLUGIN_DEFAULT
    this.route = route
    this.operations = []
    return this
  }

  static async getPrinters(route) {
    if (route) ConectorPlugin.URL_PLUGIN_DEFAULT = route
    return fetch(ConectorPlugin.URL_PLUGIN_DEFAULT + '/printers').then((r) =>
      r.json()
    )
  }

  texto(text) {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionText,
        text
      )
    )
    return this
  }

  textWithAccents(text) {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionAccentedText,
        text
      )
    )
    return this
  }

  feed(n) {
    if (!parseInt(n) || parseInt(n) < 0) {
      throw Error('Invalid value for feed')
    }
    this.operations.push(
      new ConectorPlugin.OperationTicket(ConectorPlugin.Constants.ActionFeed, n)
    )
    return this
  }

  setFontSize(widthMultiplier, highMultiplier) {
    widthMultiplier = parseInt(widthMultiplier)
    highMultiplier = parseInt(highMultiplier)
    if (widthMultiplier < 1 || widthMultiplier > 8)
      throw 'Width multiplier is out of range'
    if (highMultiplier < 1 || highMultiplier > 8)
      throw 'High multiplier is out of range'
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionTextSize,
        `${widthMultiplier},${highMultiplier}`
      )
    )
    return this
  }

  setFont(font) {
    if (
      font !== ConectorPlugin.Constants.FontA &&
      font !== ConectorPlugin.Constants.FontB &&
      font !== ConectorPlugin.Constants.FontC
    )
      throw Error('Invalid Font')
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionFont,
        font
      )
    )
    return this
  }

  setEmphasized(val) {
    if (val !== 0 && val !== 1) {
      throw Error('Value must be 1 for true, 0 for false')
    }
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionEmphasize,
        val
      )
    )
    return this
  }

  setJustification(justification) {
    if (
      justification !== ConectorPlugin.Constants.AlignmentCenter &&
      justification !== ConectorPlugin.Constants.AlignmentRight &&
      justification !== ConectorPlugin.Constants.AlignmentLeft
    ) {
      throw Error(`Alignment ${justification} invalid`)
    }
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionJustification,
        justification
      )
    )
    return this
  }

  cut() {
    this.operations.push(
      new ConectorPlugin.OperationTicket(ConectorPlugin.Constants.ActionCut, '')
    )
    return this
  }

  openDrawer() {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionPulse,
        ''
      )
    )
    return this
  }

  cutPartially() {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionCutPartial,
        ''
      )
    )
    return this
  }

  imageFromUrl(url) {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionImage,
        url
      )
    )
    return this
  }

  imageLocal(location) {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionImageLocal,
        location
      )
    )
    return this
  }

  qr(contents) {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionQr,
        contents
      )
    )
    return this
  }

  qrAsImage(contents) {
    this.operations.push(
      new ConectorPlugin.OperationTicket(
        ConectorPlugin.Constants.ActionQrAsImage,
        contents
      )
    )
    return this
  }

  validateBarcodeType(type) {
    if (
      [
        ConectorPlugin.Constants.ActionBarcode128,
        ConectorPlugin.Constants.ActionBarcode39,
        ConectorPlugin.Constants.ActionBarcode93,
        ConectorPlugin.Constants.ActionBarcodeItf,
        ConectorPlugin.Constants.ActionBarcodeJan13,
        ConectorPlugin.Constants.ActionBarcodeJan8,
        ConectorPlugin.Constants.ActionBarcodeTextAbove,
        ConectorPlugin.Constants.ActionBarcodeTextBelow,
        ConectorPlugin.Constants.ActionBarcodeTextNone,
        ConectorPlugin.Constants.ActionBarcodeUPCA,
        ConectorPlugin.Constants.ActionBarcodeUPCE,
      ].indexOf(type) === -1
    )
      throw Error('Barcode type not supported')
  }

  codigoDeBarras(contents, type) {
    this.validateBarcodeType(type)
    this.operations.push(new ConectorPlugin.OperationTicket(type, contents))
    return this
  }

  async printIn(printerName) {
    const payload = {
      operations: this.operations,
      printer: printerName,
    }
    const response = await fetch(this.route + '/imprimir', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return await response.json()
  }
}
