"use client"

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts'
import PocketBase from 'pocketbase'

async function getData() {
	const pb = new PocketBase('http://127.0.0.1:8090')
	await pb.admins.authWithPassword('test@test.com', 'dupa12345678')

	const header = await pb.collection('chart_header').getFirstListItem('id = "2guodga73fv569i"')
	const data = await pb.collection('chart_data').getFullList()
	return { header, data };
}

export default function Home() {
	const [chartHeader, setChartHeader] = useState({});
	const [chartData, setChartData] = useState([]);
	const chartRef = useRef();

	useEffect(() => {
		getData()
			.then(({header, data}) => {
				setChartHeader(header);
				setChartData(data);
			})
		}, [])

	useEffect(() => {
		const chart = createChart(chartRef.current, { width: 400, height: 300 });
		const lineSeries = chart.addLineSeries();
		lineSeries.setData(chartData)
	}, [chartData]);

	return <div>
		<h3>{JSON.stringify(chartHeader)}</h3>
		<div ref={chartRef} />
	</div>
}
