import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createFolderApi } from "../api/folder";
import useFolders from "../hooks/useFolders";
import useForms from "../hooks/useForms";
import FolderContainer from "../components/FolderContainer";
import ModalPage from "../components/ModalPage";
import FormList from "../components/FormList";
import styles from "./UserWorkspace.module.css";

import {
  img_folder,
  add_symbol,
  arrow_down,
  arrow_up,
} from "../data/useImportAssets";
import { clearFolderId } from "../configureslice/workspaceSlice";
import {
  setIsAuthenticated,
  setCurrentUser,
} from "../configureslice/reduxSlice";
import { useTheme } from "../context/ThemeContext";

const UserWorkspacePage = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [permission, setPermission] = useState("edit");
  const [email, setEmail] = useState("");

  const [workspaces, setWorkspaces] = useState([]);
  const { folders, fetchFolders } = useFolders();
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, loading, error } = useForms();

  const isViewMode = permission === "view";
  const handleSelectChange = (event) => {
    const value = event.target.getAttribute("data-value");
    if (value === "settings") {
      navigate("/settings");
    } else if (value === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      dispatch(setIsAuthenticated(false));
      dispatch(setCurrentUser(null));
      // navigate('/');
    }
    setIsDropdownOpen(false);
  };
  const handleWorkspaceSelect = (workspaceId) => {
    // setCurrentWorkspaceId(workspaceId);
    dispatch(setCurrentUser(workspaceId));
  };
  const handleCreateFolder = async (name) => {
    if (isViewMode) {
      toast.error("You do not have permission to add folders.");
      return;
    } else {
      if (!name.trim()) {
        toast.error("Folder name is required");
        return;
      }
      try {
        await createFolderApi({ name });
        toast.success("Folder created successfully");
        setIsModalOpen(false);
        await fetchFolders();
      } catch (error) {
        toast.error("Failed to create folder");
        console.error("Error creating folder:", error);
      }
    }
  };

  const handleClearFolder = () => {
    dispatch(clearFolderId());
  };
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleInviteByEmail = async ({ workspaceId }) => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/workspaces/share/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, permission, workspaceId }),
        }
      );
      if (response.ok) {
        toast.success("Invitation sent successfully!");
        setEmail("");
        fetchWorkspaces(); // Refresh shared workspace list
      } else {
        console.log({ response });
        toast.error("Failed to send invitation");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleCopyLink = async ({ workspaceId }) => {
    console.log({email})
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        "http://localhost:3000/workspaces/share/link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, permission, workspaceId }),
        }
      );
      if (response.ok) {
        toast.success("Invitation sent successfully!");
        setEmail("");
        fetchWorkspaces(); // Refresh shared workspace list
      } else {
        console.log({ response });
        toast.error("Failed to send invitation");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch("http://localhost:3000/workspaces", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { workspaces } = await response.json();
      setWorkspaces([...workspaces]);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const handleclose = () => {
    setIsShareModalOpen(false);
  };
  useEffect(() => {
    fetchWorkspaces();
  }, []);
  return (
    <div
      className={`${styles.workspace_body} ${
        isDarkMode ? styles.dark : styles.light
      }`}
    >
      {isShareModalOpen && (
        <div className={styles.sharemodal}>
          <div className={styles.modalContent}>
            <div
              onClick={handleclose}
              style={{
                cursor: "pointer",
                color: "red",
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
            >
              X
            </div>
            <h3 style={{ position: "absolute", top: "37px" }}>
              Invite by email
            </h3>
            <div>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="edit">Edit</option>
                <option value="view">View</option>
              </select>
              <input
                type="email"
                placeholder="Enter email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className={styles.sendinvite}
                onClick={() =>
                  handleInviteByEmail({ workspaceId: currentUser.userId })
                }
              >
                Send by Email
              </button>
            </div>
            <h3 className={styles.headerlink}>Invite by link</h3>
            <button
              className={styles.linkbutton}
              onClick={() =>
                handleCopyLink({ workspaceId: currentUser.userId })
              }
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <header className={`${styles.header} ${isDarkMode ? "" : styles.hdark}`}>
        <div
          className={`${isDarkMode ? "" : styles.borderlight} ${
            styles.user_title
          } ${styles.dropdown}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className={`${isDarkMode ? styles.dark : styles.light}`}>
            {currentUser.username}'s workspace
          </span>
          <span
            className={`${!isDarkMode ? styles.darkarrow : ""}`}
            style={{
              marginLeft: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isDropdownOpen ? (
              <img src={arrow_up} alt="arrow_up" />
            ) : (
              <img src={arrow_down} alt="arrow_down" />
            )}
          </span>

          <div
            className={`${styles.dropdownMenu} ${
              isDropdownOpen ? styles.show : ""
            }`}
          >
            <div
              className={`${styles.dropdownItem} ${
                isDarkMode ? "" : styles.bglight
              }`}
              data-value="settings"
              onClick={handleSelectChange}
            >
              Settings
            </div>
            <div
              className={`${styles.dropdownItem} ${
                isDarkMode ? "" : styles.bglight
              } ${styles.logout}`}
              data-value="logout"
              onClick={handleSelectChange}
            >
              Log Out
            </div>
            <div>
              {workspaces.map((item) => (
                <div
                  onClick={() => handleWorkspaceSelect(item.workspaceId)}
                >
                  {item.name}'s Workspace
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
            position: "absolute",
            right: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              padding: "8px 9px",
            }}
          >
            Light
            <div
              onClick={toggleTheme}
              style={{
                borderRadius: "20px",
                width: "50px",
                height: "20px",
                backgroundColor: isDarkMode
                  ? "rgba(26, 95, 255, 1)"
                  : "rgba(177, 177, 177, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: isDarkMode ? "flex-end" : "flex-start",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  borderRadius: "50px",
                  backgroundColor: "white",
                  height: "15px",
                  width: "15px",
                }}
              ></div>
            </div>
            Dark
          </div>
          <div style={{ padding: "8px 9px" }}>
            <button className={styles.sharebutton} onClick={handleShareClick}>
              Share
            </button>
          </div>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.folder_div}>
          <div
            className={`${styles.folder_container} ${
              isDarkMode ? styles.bgcolor1 : styles.bgcolor2
            }`}
            onClick={() => !isViewMode && setIsModalOpen(true)}
            disabled={isViewMode}
          >
            <div
              className={`${styles.folder_img} ${
                isDarkMode ? styles.dimage : styles.limage
              }`}
            >
              <img src={img_folder} alt="folder" />
            </div>
            <div className={styles.folder_title}>
              <span
                className={`${styles.typography} ${
                  isDarkMode ? styles.darktext : styles.lighttext
                }`}
              >
                Create a folder
              </span>
            </div>
          </div>
          <div>
            <FolderContainer folders={folders} fetchFolders={fetchFolders} />
          </div>
        </div>
        <div className={styles.formList}>
          <section className={styles.formListContainer}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              <FormList forms={forms} onClearFolder={handleClearFolder} activeWorkspace={''} />
            )}
          </section>
          <div className={styles.modal}>
            <ModalPage
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleConfirm={handleCreateFolder}
              message="Create a new folder"
              confirmButtonText="Done"
              showInput={true}
            />
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default UserWorkspacePage;
