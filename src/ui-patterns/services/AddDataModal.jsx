import React, { Component } from 'react';
import { Form, FormGroup, DatePickerInput, Select, SelectItem, Button, ButtonSet, DatePicker, ComposedModal, ModalBody, ModalHeader, RadioButtonGroup, RadioButton, TextArea, TextInput } from 'carbon-components-react';
class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            fields: {
                service_id: '',
                grouping: '',
                ibm_service: '',
                desc: '',
                deployment_method: '',
                fs_ready: false,
                quarter: '',
                date: '',
                provision: '',
                cloud_automation_id: '',
                hybrid_automation_id: ''
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/\"id\":/g, "\"service_id\":"));
            this.state = {
                fields: jsonObject
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(field, e) {
        let fields = this.state.fields;

        if (field === "fs_ready") {
            fields[field] = Boolean(e);
        } else if (field === "date") {
            fields[field] = e.target.value;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });

    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.props.isUpdate) {
            const jsonData = this.props.service.doAddService(this.state.fields);
        } else {
            this.props.service.doUpdateService(this.state.fields, this.state.fields.service_id);
        }
        this.props.handleClose();
    }
    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row">

                    <ComposedModal
                        open={this.props.show}
                        onClose={this.props.handleClose}>
                        <ModalHeader >
                            <h2 className="bx--modal-header__label">Service resource</h2>
                            <h3 className="bx--modal-header__heading">Add a Service</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>

                                <TextInput
                                    data-modal-primary-focus
                                    id="seviceId"
                                    name="service_id"
                                    disabled={this.props.isUpdate ? true : false}
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "service_id")}
                                    value={this.state.fields.service_id}
                                    labelText="Service ID"
                                    placeholder="e.g. appid,atracker,cos"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <Select id="group" name="grouping"
                                    labelText="Grouping"
                                    defaultValue={!this.state.fields.grouping ? 'placeholder-item' : this.state.fields.grouping}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "grouping")}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="Security & Identity" text="Security & Identity" />
                                    <SelectItem value="Developer Tools" text="Developer Tools" />
                                    <SelectItem value="Databases" text="Databases" />
                                    <SelectItem value="Network" text="Network" />
                                    <SelectItem value="Storage" text="Storage" />
                                    <SelectItem value="Compute" text="Compute" />
                                    <SelectItem value="IBM Cloud Platform Services" text="IBM Cloud Platform Services" />
                                </Select>
                                <TextInput
                                    data-modal-primary-focus
                                    id="ibmService"
                                    name="ibm_service"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.ibm_service}
                                    onChange={this.handleChange.bind(this, "ibm_service")}
                                    labelText="IBM Service"
                                    placeholder="e.g. App ID,Databases for Redis ect..."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextArea
                                    cols={50}
                                    id="desc"
                                    name="desc"
                                    value={this.state.fields.desc}
                                    onChange={this.handleChange.bind(this, "desc")}
                                    invalidText="A valid value is required"
                                    labelText="Description"
                                    placeholder="Service description"
                                    rows={4}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="dplMethod"
                                    name="deployment_method"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.deployment_method}
                                    onChange={this.handleChange.bind(this, "deployment_method")}
                                    labelText="Deployment Method"
                                    placeholder="e.g. managed_service,platform"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FormGroup legendText="FS Ready">
                                    <RadioButtonGroup
                                        name="fs_ready"
                                        onChange={this.handleChange.bind(this, "fs_ready")}
                                        defaultSelected={this.state.fields.fs_ready}>
                                        <RadioButton
                                            value="true"
                                            id="radio-1"
                                            name="fs_ready"
                                            labelText="True"
                                        />
                                        <RadioButton
                                            value="false"
                                            labelText="False"
                                            name="fs_ready"
                                            id="radio-2"
                                        />
                                    </RadioButtonGroup>
                                </FormGroup>
                                <TextInput
                                    data-modal-primary-focus
                                    id="quarter"
                                    name="quarter"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.quarter}
                                    onChange={this.handleChange.bind(this, "quarter")}
                                    labelText="Quarter"
                                    placeholder="e.g. github.com"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <DatePicker datePickerType="single" dateFormat='Y-m-d' >
                                    <DatePickerInput
                                        placeholder="Y-m-d"
                                        labelText="Date"
                                        id="date-time"
                                        name="date"
                                        pattern="\d{4}\-\d{2}\-\d{2}"
                                        value={this.state.fields.date}
                                        onFocus={this.handleChange.bind(this, "date")}

                                    />
                                </DatePicker>

                                <Select id="provision" name="provision"
                                    labelText="Provision"
                                    defaultValue={!this.state.fields.provision ? 'placeholder-item' : this.state.fields.provision}
                                    invalidText="Please Select The Value"
                                    onChange={this.handleChange.bind(this, "provision")}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="Terraform" text="Terraform" />
                                    <SelectItem value="Operator" text="Operator" />
                                    <SelectItem value="Ansible" text="Ansible" />
                                </Select>
                                <TextInput
                                    data-modal-primary-focus
                                    id="caId"
                                    name="cloud_automation_id"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.cloud_automation_id}
                                    onChange={this.handleChange.bind(this, "cloud_automation_id")}
                                    labelText="CAID"
                                    placeholder="e.g. ibm-access-group"
                                    style={{ marginBottom: '1rem' }}
                                />

                                <ButtonSet style={{ margin: '2rem 0 2rem 0' }}>
                                    <Button kind="primary" type="submit" style={{ margin: '0 1rem 0 0' }}>
                                        {!this.props.isUpdate && "Submit"}
                                        {this.props.isUpdate && "Update"}
                                    </Button>
                                    <Button kind='secondary' type="reset" style={{ margin: '0 1rem 0 1rem' }}> Reset</Button>
                                </ButtonSet>
                            </Form>
                        </ModalBody>
                    </ComposedModal>

                </div>
            </div>
        );
    }

}
export default FormModal;