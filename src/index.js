import React from "react";
import ReactDOM from "react-dom";
import { Table, Divider, Icon, Button, Input, InputNumber, Popconfirm, Form } from "antd";
import "./index.css";
import "antd/dist/antd.css";

const data = [];
for (let i = 0; i < 6; i++) {
    data.push({
        key: i,
        name: 'C#',
        annualLeave: 10,
        overTimeDate: '2018-07-07',
        overTimeHour: 8,
        leaveDate: '2018-07-30',
        leaveHour: 4,
        remainAnnualLeave: 10,
        remainOverTime: 4,
        remainTotal: 10.5,
        children: [{
            key: i + '' + i,
            name: '小明',
            annualLeave: 5,
            overTimeDate: '2018-07-07',
            overTimeHour: 4,
            leaveDate: '2018-07-30',
            leaveHour: 2,
            remainAnnualLeave: 5,
            remainOverTime: 2,
            remainTotal: 5.25,
        }, {

            key: i + '' + (i + 1),
            name: '小红',
            annualLeave: 5,
            overTimeDate: '2018-07-07',
            overTimeHour: 4,
            leaveDate: '2018-07-30',
            leaveHour: 2,
            remainAnnualLeave: 5,
            remainOverTime: 2,
            remainTotal: 5.25,
        }]
    });
}

// rowSelection objects indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
};

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data, editingKey: '' };
        this.columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            filters: [{
                text: 'Joe',
                value: 'Joe',
            }, {
                text: 'John',
                value: 'John',
            }],
            onFilter: (value, record) => record.name.indexOf(value) === 0,
        }, {
            title: '年假',
            dataIndex: 'annualLeave',
            key: 'annualLeave',
            width: '5%',
            sorter: (a, b) => a.annualLeave - b.annualLeave,
            editable: true,
        }, {
            title: '加班日期',
            dataIndex: 'overTimeDate',
            key: 'overTimeDate',
            width: '20%',
            editable: true,
        }, {
            title: '加班时长',
            dataIndex: 'overTimeHour',
            key: 'overTimeHour',
            width: '5%',
            editable: true,
        }, {
            title: '请假日期',
            dataIndex: 'leaveDate',
            key: 'leaveDate',
            width: '20%',
            editable: true,
        }, {
            title: '请假时长',
            dataIndex: 'leaveHour',
            key: 'leaveHour',
            width: '5%',
            editable: true,
        }, {
            title: '年假剩余',
            dataIndex: 'remainAnnualLeave',
            key: 'remainAnnualLeave',
            width: '5%',
            editable: true,
        }, {
            title: '加班剩余',
            dataIndex: 'remainOverTime',
            key: 'remainOverTime',
            width: '5%',
            editable: true,
        }, {
            title: '剩余合计',
            dataIndex: 'remainTotal',
            key: 'remainTotal',
            width: '8%',
            editable: true,
        }, {
            title: '操作',
            key: 'operation',
            width: '12%',
            render: (text, record) => {
                const editable = this.isEditing(record);
                return (
                    <div>
                        {editable ? (
                            <span>
                                <EditableContext.Consumer>
                                    {form => (
                                        <a
                                            href="javascript:;"
                                            onClick={() => this.save(form, record.key)}
                                            style={{ marginRight: 8 }}
                                        >
                                            Save
                            </a>
                                    )}
                                </EditableContext.Consumer>
                                <Popconfirm
                                    title="Sure to cancel?"
                                    onConfirm={() => this.cancel(record.key)}
                                >
                                    <a>Cancel</a>
                                </Popconfirm>
                            </span>
                        ) : (
                                <span>
                                    <a onClick={() => this.edit(record.key)}>Edit</a>
                                    <Divider type="vertical" />
                                    <a href="javascript:;">Delete</a>
                                </span>
                            )}
                    </div>
                );
            },
        }];
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        this.setState({ editingKey: key });
    }

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <Table
                components={components}
                columns={columns}
                rowSelection={rowSelection}
                dataSource={data}
                bordered
                size="middle"
                scroll={{ x: '90%', y: 360 }}
            />
        );
    }
}

ReactDOM.render(<EditableTable />, document.getElementById("root"));