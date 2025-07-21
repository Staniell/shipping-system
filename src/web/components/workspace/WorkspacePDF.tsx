import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { WorkSpaceType, Shipment } from '../../types/workspace';
import { kFormatter } from '../../helpers/number';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  workspaceId: {
    fontSize: 10,
    color: 'grey',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 15,
    width: '30%',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  tableContainer: {
    marginTop: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableCol: {
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 10,
  },
  buildNumCol: { width: '25%' },
  descCol: { width: '35%' },
  orderNumCol: { width: '25%' },
  costCol: { width: '15%' },
  buildShipmentsBuildNumCol: { width: '40%' },
  buildShipmentsNumCol: { width: '30%' },
  buildShipmentsCostCol: { width: '30%' },
});

interface WorkspacePDFProps {
  workspace: WorkSpaceType;
}

const WorkspacePDF: React.FC<WorkspacePDFProps> = ({ workspace }) => {
  const totalShipments = workspace.buildShipments.reduce((sum, bs) => sum + bs.shipments.length, 0);
  const totalCost = workspace.buildShipments.flatMap(bs => bs.shipments).reduce((sum, s) => sum + s.cost, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{workspace.title}</Text>
          <Text style={styles.workspaceId}>ID: {workspace.id}</Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Build Shipments</Text>
            <Text style={styles.summaryValue}>{workspace.buildShipments.length}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Total Shipments</Text>
            <Text style={styles.summaryValue}>{totalShipments}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Total Cost</Text>
            <Text style={styles.summaryValue}>${kFormatter(totalCost)}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Shipments Overview</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableColHeader, styles.buildNumCol]}>Build Number</Text>
                    <Text style={[styles.tableColHeader, styles.descCol]}>Description</Text>
                    <Text style={[styles.tableColHeader, styles.orderNumCol]}>Order Number</Text>
                    <Text style={[styles.tableColHeader, styles.costCol]}>Cost</Text>
                </View>
                {workspace.buildShipments.flatMap(bs => bs.shipments.map(s => ({...s, buildNumber: bs.buildNumber}))).map((shipment: Shipment & { buildNumber: string }) => (
                    <View style={styles.tableRow} key={shipment.id}>
                        <Text style={[styles.tableCol, styles.buildNumCol]}>{shipment.buildNumber}</Text>
                        <Text style={[styles.tableCol, styles.descCol]}>{shipment.description}</Text>
                        <Text style={[styles.tableCol, styles.orderNumCol]}>{shipment.orderNumber}</Text>
                        <Text style={[styles.tableCol, styles.costCol]}>${kFormatter(shipment.cost)}</Text>
                    </View>
                ))}
            </View>
        </View>

        <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Build Shipments Overview</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableColHeader, styles.buildShipmentsBuildNumCol]}>Build Number</Text>
                    <Text style={[styles.tableColHeader, styles.buildShipmentsNumCol]}>Number of Shipments</Text>
                    <Text style={[styles.tableColHeader, styles.buildShipmentsCostCol]}>Total Cost</Text>
                </View>
                {workspace.buildShipments.map(bs => (
                    <View style={styles.tableRow} key={bs.id}>
                        <Text style={[styles.tableCol, styles.buildShipmentsBuildNumCol]}>{bs.buildNumber}</Text>
                        <Text style={[styles.tableCol, styles.buildShipmentsNumCol]}>{bs.shipments.length}</Text>
                        <Text style={[styles.tableCol, styles.buildShipmentsCostCol]}>${kFormatter(bs.shipments.reduce((sum, s) => sum + s.cost, 0))}</Text>
                    </View>
                ))}
            </View>
        </View>
      </Page>
    </Document>
  );
};

export default WorkspacePDF;
