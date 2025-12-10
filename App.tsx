import { Button, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions, CameraView, BarcodeScanningResult, BarcodeType } from 'expo-camera';
import { useEffect, useState } from 'react';

const BARCODE_TYPES = [
  'qr', 'ean13', 'ean8', 'code128', 'code39', 'code93', 'upc_a', 'upc_e', 'pdf417', 'aztec', 'datamatrix', 'itf14',
];

const App = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect((): void => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = (result: BarcodeScanningResult): void => {
    if(!scanned && result?.data) {
      setScanned(true);
      setBarcode(result.data);
    }
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView 
        style={{ flex: 1 }}
        facing='back'
        active={!scanned}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES as BarcodeType[] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View pointerEvents='box-none' style={StyleSheet.absoluteFill}>
        <View style={styles.overlay} pointerEvents='box-none'>
          {barcode && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>Barcode: {barcode}</Text>
              <Button title="Scan again" onPress={() => {setScanned(false); setBarcode(null); }} />
            </View> 
          )}

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  resultBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  resultText: {
    color: '#fff',
    marginBottom: 8,
  },
});

export default App;
