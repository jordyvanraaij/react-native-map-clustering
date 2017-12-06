import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { height as h, width as w } from 'react-native-dimension';
import CustomMarker from './CustomMarker';
import SuperCluster from 'supercluster';
import geoViewport from '@mapbox/geo-viewport';

const superCluster = SuperCluster({
	maxZoom: this.props.maxZoom,
	radius: this.props.radius
});

class MapWithClustering extends Component {
	state = {
		markers: [],
		markersOnMap: [],
		region: this.props.initialRegion
	}

	componentWillMount() {
		const { children } = this.props;

		if (children)	this.createMarkersOnMap(children);
	}

	componentWillReceiveProps({ children }) {
		if (children) this.createMarkersOnMap(children);
	}

	createMarkersOnMap(children) {
		let markers = [];
		children.map((item) => {
			markers.push({
				geometry: {
					coordinates: [item.props.coordinate.longitude, item.props.coordinate.latitude],
					type: 'Point'
				},
				item: item,
				properties: {
					point_count: 0
				}
			});
		});

		this.setState({	markers }, () => {
			this.calculateClustersForMap();
		});
	}

	onRegionChangeComplete(region) {
		this.setState({ region }, () => {
			this.calculateClustersForMap();
		});
	}

	calculateBBox() {
		const { region } = this.state;
		return [
			region.longitude - region.longitudeDelta,
			region.latitude - region.latitudeDelta,
			region.longitude + region.longitudeDelta,
			region.latitude + region.latitudeDelta
		];
	}

	getZoomLevel(bbox) {
		const height = h(100);
		const width = w(100);
		return geoViewport.viewport(bbox, [height, width]);
	}

	getClusters(bbox, zoom) {
		superCluster.load(this.state.markers);
		superCluster.getClusters([bbox[0], bbox[1], bbox[2], bbox[3]], zoom);
	}

	onClusterPress(coords, cluster) {
		superCluster.getLeaves(cluster);
		this.props.onClusterPress(coords);
	}

	calculateClustersForMap() {
		const {
			clusterColor,
			clusterTextColor,
			clusterBorderColor,
			clusterBorderWidth
		} = this.props;
		const bbox = this.calculateBBox();
		const zoom = this.getZoomLevel(bbox).zoom || 0;
		const clusters = this.getClusters(bbox, zoom);

		let markersOnMap = [];
		for (let i = 0; i < clusters.length; i++) {
			markersOnMap.push(
				<CustomMarker
					key={i}
					onClusterPress={this.onClusterPress}
					clusterColor={clusterColor}
					clusterTextColor={clusterTextColor}
					clusterBorderColor={clusterBorderColor}
					clusterBorderWidth={clusterBorderWidth}
					{...clusters[i]}
				>
					{clusters[i].properties.point_count === 0 ? clusters[i].item : null}
				</CustomMarker>
			);
		}

		this.setState({ markersOnMap });
	}

	render() {
		return (
			<MapView
				{...this.props}
				ref={(ref) => this.root = ref}
				initialRegion={this.state.region}
				onRegionChangeComplete={(region) => {
					if (this.props.onRegionChangeComplete) {
						this.props.onRegionChangeComplete(region);
					}
					this.onRegionChangeComplete(region);
				}}>
					{this.state.markersOnMap}
			</MapView>
		);
	}
}

MapWithClustering.defaultProps = {
	clusterColor: '#F5F5F5',
	clusterTextColor: '#FF5252',
	clusterBorderColor: '#FF5252',
	clusterBorderWidth: 1,
	maxZoom: 10,
	radius: w(100) / 22
};

export default MapWithClustering;