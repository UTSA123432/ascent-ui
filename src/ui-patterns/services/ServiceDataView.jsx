import React, { Component } from "react";
import Header from "../ui-shell/Header";

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    WarningAlt16,
    Launch16
} from '@carbon/icons-react';
import {
    DataTable, DataTableSkeleton, TableContainer, Table, Tag, TagSkeleton,
    TableToolbar, OverflowMenu, OverflowMenuItem, ToastNotification,
    TableSelectAll, TableSelectRow, TableBatchActions, TableBatchAction, 
    TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, 
    TableBody, TableCell
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';
import { serviceHeader } from '../data/data';
import FormModal from './AddDataModal';
import ServiceDetailsPane from './ServiceDetailsPane';
import ValidateModal from "../ValidateModal"


class ServiceDataView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            data: [],
            filterData: [],
            compositeData: [],
            headerData: serviceHeader,
            show: false,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 15,
            isUpdate: false,
            serviceRecord: [],
            selectedRows: [],
            showValidate: false,
            isPaneOpen: false,
            dataDetails: false,
            notifications: []
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.openPane = this.openPane.bind(this);
        this.hidePane = this.hidePane.bind(this);
        this.validateCancel = this.validateCancel.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.filterTable = this.filterTable.bind(this);
    }

    async loadTable() {
        const jsonData = await this.props.service.getServices();
        const serviceDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"service_id\":/g, "\"id\":"));
        for (let index = 0; index < serviceDetails.length; index++) {
            let row = serviceDetails[index];
            row.service = {
                service_name: row.ibm_catalog_service || row.service_id,
                service_id: row.id
            };
            row.automation_id = row.cloud_automation_id || '';
        }
        this.props.service.getServicesComposite().then((res) => {
            if(res && res.length) {
                let compositeData = {};
                for (let ix in res) {
                    compositeData[res[ix].service_id] = res[ix];
                }
                console.log(compositeData);
                this.setState({
                    compositeData: compositeData
                })
            }
        });
        this.setState({
            data: serviceDetails,
            filterData: serviceDetails,
            totalItems: serviceDetails.length
        });
    }

    async componentDidMount() {
        fetch('/userDetails')
        .then(res => res.json())
        .then(user => {
            this.setState({ user: user || undefined })
        })
        await this.loadTable();
    }

    openPane = async (serviceId) => {
        if (serviceId) {
            this.setState({
                isPaneOpen: true,
                dataDetails: false
            });
            let serviceDetails = await this.props.service.getServiceDetails(serviceId);
            let catalog = await this.props.service.getServiceCatalog(serviceId);
            if (serviceDetails.cloud_automation_id) {
                let automation = await this.props.automationService.getAutomation(serviceDetails.cloud_automation_id);
                serviceDetails.automation = automation;
            }
            serviceDetails.service = serviceDetails;
            serviceDetails.catalog = catalog;
            this.setState({
                dataDetails: serviceDetails
            });
        }
    };

    hidePane = () => {
        this.setState({ isPaneOpen: false });
    };

    deleteServices(rows) {
        this.setState({
            showValidate: true,
            selectedRows: rows
        })
    }

    // API issues there So need to work on this function
    validateSubmit() {
        const rows = this.state.selectedRows;
        let count = 0;
        let total_count = rows.length;
        let count_success = 0;
        rows.forEach(data => {
            this.props.service.doDeleteService(data.id).then(res => {
                count = count + 1;
                if (res.statusCode === 204) {
                    count_success = count_success + 1;
                }
                if (count === total_count && count === count_success) {
                    this.addNotification('success', 'Success', `${count_success} service(s) successfully deleted!`)
                    this.setState({
                        showValidate: false ,
                        selectedRows: []
                    });
                    this.loadTable();
                } else if (count === total_count) {
                    this.addNotification('error', 'Error', `${count_success} service(s) successfully deleted, ${count - count_success} error(s)!`)
                    this.setState({
                        showValidate: false ,
                        selectedRows: []
                    });
                    this.loadTable();
                }
            });
        });
    }

    validateCancel = () => {
        this.setState({
            showValidate: false ,
            selectedRows: []
        });
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({
            isUpdate: false,
            show: false
        });
        this.loadTable();
    };

    doUpdateService(serviceId) {
        this.setState({
            show: true,
            isUpdate: true,
            serviceRecord: this.state.data.find(element => element.id === serviceId )
        });

    }

    /** Notifications */

    addNotification(type, message, detail) {
        this.setState(prevState => ({
          notifications: [
            ...prevState.notifications,
            {
              message: message || "Notification",
              detail: detail || "Notification text",
              severity: type || "info"
            }
          ]
        }));
    }

    renderNotifications() {
        return this.state.notifications.map(notification => {
            return (
            <ToastNotification
                title={notification.message}
                subtitle={notification.detail}
                kind={notification.severity}
                timeout={10000}
                caption={false}
            />
            );
        });
    }

    /** Notifications END */

    async filterTable(searchValue) {
        if (searchValue) {
            const filterData = this.state.data.filter(elt => elt.grouping === searchValue || elt.deployment_method === searchValue || elt.provision === searchValue || elt?.service?.service_name?.includes(searchValue) || elt?.service?.service_id?.includes(searchValue));
            this.setState({
                filterData: filterData,
                firstRowIndex: 0,
                totalItems: filterData.length
            });
        } else {
            this.setState({
                filterData: this.state.data,
                firstRowIndex: 0,
                totalItems: this.state.data.length
            });
        }
    }

    render() {
        let data = this.state.filterData;
        let headers = this.state.headerData;
        let showModal = this.state.show;
        let table;
        if (this.state.data.length === 0) {
            table = <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={15}
                showHeader={false}
                headers={null}
            />
        } else {
            table = <>
                        <DataTable rows={data.slice(
                            this.state.firstRowIndex,
                            this.state.firstRowIndex + this.state.currentPageSize
                        )} headers={headers}>
                            {({
                                rows,
                                headers,
                                getHeaderProps,
                                getSelectionProps,
                                getToolbarProps,
                                getBatchActionProps,
                                getRowProps,
                                getTableProps,
                                selectedRows

                            }) => (
                                    <TableContainer>
                                        <TableToolbar>
                                            {this.state.user?.role === "admin" && <TableBatchActions {...getBatchActionProps()} shouldShowBatchActions={getBatchActionProps().totalSelected}>
                                                <TableBatchAction
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                    renderIcon={Delete}
                                                    onClick={() => this.deleteServices(selectedRows)}>
                                                    Delete
                                                </TableBatchAction>

                                            </TableBatchActions>}
                                            <TableToolbarContent>

                                                <TableToolbarSearch onChange={(event) => this.filterTable(event.target.value)} />
                                                {this.state.user?.role === "admin" && <Button
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                    size="small"
                                                    kind="primary"
                                                    onClick={this.showModal}>Add</Button>}
                                            </TableToolbarContent>
                                        </TableToolbar>
                                        <Table {...getTableProps()}>
                                            <TableHead>
                                                <TableRow>
                                                    {this.state.user?.role === "admin" && <TableSelectAll {...getSelectionProps()} />}
                                                    {headers.map((header) => (
                                                        <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                                            {header.header}
                                                        </TableHeader>
                                                    ))}
                                                    <TableHeader />
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row, i) => (
                                                    <TableRow key={row.id} {...getRowProps({ row })}>
                                                        {this.state.user?.role === "admin" && <TableSelectRow {...getSelectionProps({ row })} />}
                                                        {row.cells.map((cell) => (
                                                            <TableCell key={cell.id} class="clickable" onClick={() => this.openPane(row.id)} >
                                                                {
                                                                    cell.info && cell.info.header === "service"?
                                                                        <Tag type="blue">
                                                                            <Link to={"/services/" + cell.value.service_id} >
                                                                            {cell.value.service_name}
                                                                            </Link>
                                                                        </Tag> 
                                                                    : cell.info && cell.info.header === "automation_id" && !cell.value ?
                                                                        <Tag type="red"><WarningAlt16 style={{'margin-right': '3px'}} /> No Automation ID</Tag>
                                                                    : cell.info && cell.info.header === "automation_id" && this.state.compositeData && this.state.compositeData[row.id] && this.state.compositeData[row.id].automation ?
                                                                        <Tag type="blue">
                                                                            <a href={"https://" + this.state.compositeData[row.id].automation.id} target="_blank">
                                                                                {this.state.compositeData[row.id].automation.name}
                                                                                <Launch16 style={{"margin-left": "3px"}}/>
                                                                            </a>
                                                                        </Tag>
                                                                    : cell.info && cell.info.header === "fs_validated" && (this?.state?.compositeData[row.id]?.fs_validated || this?.state?.compositeData[row.id]?.catalog?.tags?.includes("fs_ready")) ?
                                                                        <Tag type="green">
                                                                            FS Validated
                                                                        </Tag>
                                                                    : cell.info && cell.info.header === "fs_validated" && this?.state?.compositeData[row.id]?.deployment_method === "Operator" ?
                                                                        <Tag style={{"background-color": "#F5606D"}}>
                                                                            OpenShift Software
                                                                        </Tag>
                                                                    : cell.info && cell.info.header === "fs_validated" && this?.state?.compositeData[row.id] ?
                                                                        <Tag>
                                                                            Not yet
                                                                        </Tag>
                                                                    : cell.info && cell.info.header === "fs_validated" ?
                                                                        <TagSkeleton></TagSkeleton>
                                                                    : cell.info && cell.info.header === "automation_id" ?
                                                                        <TagSkeleton></TagSkeleton>
                                                                    :
                                                                        cell.value
                                                                }
                                                            </TableCell>
                                                        ))}
                                                        <TableCell className="bx--table-column-menu">
                                                            <OverflowMenu light flipped>
                                                                <Link class="bx--overflow-menu-options__option" to={"/services/" + row.id}>
                                                                    <OverflowMenuItem itemText="Details" />
                                                                </Link>
                                                                {this.state.user?.role === "admin" && <OverflowMenuItem 
                                                                    itemText="Edit"
                                                                    onClick={() => this.doUpdateService(row.id)}
                                                                >
                                                                </OverflowMenuItem>}
                                                            </OverflowMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                        </DataTable>
                        <Pagination
                            totalItems={this.state.totalItems}
                            backwardText="Previous page"
                            forwardText="Next page"
                            pageSize={this.state.currentPageSize}
                            pageSizes={[5, 10, 15, 25]}
                            itemsPerPageText="Items per page"
                            onChange={({ page, pageSize }) => {
                                if (pageSize !== this.state.currentPageSize) {
                                    this.setState({
                                        currentPageSize: pageSize
                                    });
                                }
                                this.setState({
                                    firstRowIndex: pageSize * (page - 1)
                                });
                            }}
                        />
            </>
        }
        return (

            <>
                <div class='notif'>
                    {this.state.notifications.length !== 0 && this.renderNotifications()}
                </div>
                <div>
                    {showModal &&
                        <FormModal 
                            toast={this.addNotification} 
                            show={this.state.show}
                            handleClose={this.hideModal}
                            service={this.props.service}
                            automationService={this.props.automationService}
                            isUpdate={this.state.isUpdate}
                            data={this.state.serviceRecord} />
                    }
                </div>
                <div>
                    {this.state.showValidate &&
                        <ValidateModal
                            danger
                            submitText="Delete"
                            heading="Delete Services"
                            message="You are about to remove services, this will delete ALL associated FS Control mappings and those services will be removed from existing Bills of Materials. This action cannot be undone, are you sure you want to proceed?"
                            show={this.state.showValidate}
                            onClose={this.validateCancel} 
                            onRequestSubmit={this.validateSubmit} 
                            onSecondarySubmit={this.validateCancel} />
                    }
                </div>
                <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col-lg-16">
                            <br></br>
                            <h2 className="landing-page__subheading">
                                Services
                            </h2>
                            <br></br>
                            <p>
                                List of IBM Cloud services
                            </p>
                            <br></br>
                        </div>
                    </div>

                    <div className="bx--row">
                        <div className="bx--col-lg-16">
                            {table}
                        </div>
                    </div>
                </div>
                <div>
                    <ServiceDetailsPane data={this.state.dataDetails} open={this.state.isPaneOpen} onRequestClose={this.hidePane}/>
                </div>
            </>
        );

    }
}
export default ServiceDataView;