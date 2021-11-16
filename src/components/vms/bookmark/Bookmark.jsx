import React, { useEffect, useState } from "react";
import { Settings } from "react-feather";
import "./Bookmark.scss";
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from "reactjs-localstorage";



const Bookmark = ({
    handleBookmarkSaveCallback,
    handleOpenBookmarkSetting,
}) => {
    const { t } = useTranslation();
    const language = reactLocalStorage.get("language");

    useEffect(() => {
        if (
            language == "vn"
                ? (document.title = "CCTV | Giám sát")
                : (document.title = "CCTV | View")
        );
    }, [t]);

    const [name, setName] = useState('');
    const errStyle = {
        display: "none",
    };
    const [errMsg, setErrMsg] = useState("");
    const handleBookmarkSave = () => {
        handleBookmarkSaveCallback(name);
        setName("");
    };
    return (
        <div className="bookmark">
            <div className="bookmark__title">{t('components.bookmark.favorite_screen')}</div>
            <div className="bookmark__name">
                <input
                    className="bookmark__input"
                    type="text"
                    value={name}
                    placeholder={t('components.bookmark.screen_name')}
                    maxLength={100}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    onBlur={(e) => {
                        setName(e.target.value.trim());
                    }}
                />
                <p className="bookmark__name-err" style={errStyle}>
                    {errMsg}
                </p>
            </div>

            <div className="bookmark__actions">
                <div className="bookmark__actions-save" onClick={handleBookmarkSave}>
                    {t('view.map.button_save')}
                </div>
                <Settings
                    className="bookmark__actions-setting"
                    onClick={handleOpenBookmarkSetting}
                    size={16}
                />
            </div>
        </div>
    );
};

export default Bookmark;
