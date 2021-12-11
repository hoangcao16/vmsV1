import {Card, Checkbox, Tabs} from 'antd';
import 'antd/dist/antd.css';
import React, {useState} from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import {useTranslation} from 'react-i18next';
import './TabType.scss';
import {bodyStyleCard, headStyleCard} from './variables';
import _ from "lodash";
import {MemoizedTabSchedule} from './TabSchedule';
import {MemoizedTabRect} from './TabRect';

const {TabPane} = Tabs;
const TabType = (props) => {
    const {cameraUuid, type} = props
    const {t} = useTranslation();
    const [checkStatus, setCheckStatus] = useState(false);

    function onChangeCheckBox(val) {
        setCheckStatus(val.target.checked)
    }

    return (
        <div className="tabs__container--tab_type">
            <div className="activate tab_type_checkbox">
                <Checkbox onChange={onChangeCheckBox}
                          checked={checkStatus}>{t('view.ai_config.activate_' + type)}</Checkbox>
            </div>

            <Card
                bodyStyle={bodyStyleCard}
                headStyle={headStyleCard}
                className="card--category"
                // headStyle={{ padding: 30 }}
            >
                <div className="">
                    <Tabs type="card">
                        {type !== "attendance" ?
                            <TabPane tab={t('view.ai_config.area_config')} key="2">
                                <MemoizedTabRect cameraUuid={cameraUuid} type={type}/>
                            </TabPane>
                            : null}
                        <TabPane tab={t('view.ai_config.schedule_config')} key="1">
                            <MemoizedTabSchedule cameraUuid={cameraUuid} type={type}/>
                        </TabPane>

                    </Tabs>
                </div>

            </Card>
        </div>
    );
};

function tabSchedulePropsAreEqual(prevTabType, nextTabType) {
    return _.isEqual(prevTabType.cameraUuid, nextTabType.cameraUuid) && _.isEqual(prevTabType.type, prevTabType.type);
}

export const MemoizedTabType = React.memo(TabType, tabSchedulePropsAreEqual);
