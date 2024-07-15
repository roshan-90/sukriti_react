import React, { useEffect, useState } from 'react';
import './TableComponent.css';

const TableComponent = ({ staticData }) => {
    console.log('staticData', staticData);

    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (staticData.length > 0) {
            if(staticData.length > 4) {
                setRecords(staticData.slice(0, 5));
            } else {
                setRecords(staticData.slice(0, staticData.length));
            }
        }
    }, [staticData]);

    const fetchMoreRecords = () => {
        console.log('page',page);
        const newPage = page + 1;
        const newRecords = staticData.slice(page * 5, newPage * 5);
        console.log('newRecords',newRecords)
        if (newRecords.length === 0) {
            alert("No more records");
        } else {
            setRecords([...records, ...newRecords]);
            setPage(newPage);
        }
    };

    const  AttributeFilter = (complexDetails,value) => {
        if (value == 1) {
            const stateNameAttribute = complexDetails.Attributes.find(attribute => attribute.Name === 'STATE_NAME');
            const stateName = stateNameAttribute ? stateNameAttribute.Value : 'Not Found';
            return stateName;
        } else if (value == 2) {
            const districtNameAttribute = complexDetails.Attributes.find(attribute => attribute.Name === 'DISTRICT_NAME');
            const districtName = districtNameAttribute ? districtNameAttribute.Value : 'Not Found';
            return districtName;
        } else if (value == 3) {
            const cityNameAttribute = complexDetails.Attributes.find(attribute => attribute.Name === 'CITY_NAME');
            const cityName = cityNameAttribute ? cityNameAttribute.Value : 'Not Found';
            return cityName;
        } else {
            
        }
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Sr.No.</th>
                        <th>Short Name</th>
                        <th>Serial Name</th>
                        <th>State</th>
                        <th>District</th>
                        <th>City</th>
                        <th>Complex</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                        records.map((record, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{record.cabin_name.split('_')[3] + '_' + record.cabin_name.split('_')[4]}</td>
                                <td>{record.serial_number}</td>
                                <td>{AttributeFilter(record.complex_details,1)}</td>
                                <td>{AttributeFilter(record.complex_details,2)}</td>
                                <td>{AttributeFilter(record.complex_details,3)}</td>
                                <td>{record.complex_details.Name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No records available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={fetchMoreRecords} style={{ display: 'block', margin: '20px auto' }}>
                Load More
            </button>
        </div>
    );
};

export default TableComponent;
