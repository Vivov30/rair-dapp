import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import "./SplashPage.css";
import "./GreymanSplashPageMobile.css";
import "./../AboutPage/AboutPageNew/AboutPageNew.css";
import Modal from "react-modal";

/* importing images*/
import Metamask from "../../images/metamask-fox.svg";
import GreyMan from "./images/greyman1.png";
import playImages from "./images/playImg.png";
import GreyManNotFun from "./images/not-fun.png";

/* importing Components*/
import TeamMeet from "./TeamMeet/TeamMeetList";
import TokenLeftGreyman from "./TokenLeft/TokenLeftGreyman";
import AuthorBlock from "./AuthorBlock/AuthorBlock";
import { Timeline } from "./Timeline/Timeline";

import { diamondFactoryAbi } from "../../contracts/index.js";
//import { rFetch } from "../../utils/rFetch.js";
import { metamaskCall } from "../../utils/metamaskUtils.js";
import { web3Switch } from "../../utils/switchBlockchain.js";
import Swal from "sweetalert2";
import NotCommercial from "./NotCommercial/NotCommercial";
import MobileCarouselNfts from "../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts";
import VideoPlayer from "../video/videoPlayerGenerall";
import setTitle from './../../utils/setTitle';
import { Countdown } from "./Timer/CountDown";

//Google Analytics
import ReactGA from 'react-ga';

// Google Analytics
const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const customStyles = {
  overlay: {
    zIndex: "1",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    fontFamily: "Plus Jakarta Text",
    borderRadius: "16px",
  },
};
const customStylesForVideo = {
  overlay: {
    zIndex: "5",
  },
  content: {
    width: "90vw",
    height: "70vh",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    fontFamily: "Plus Jakarta Text",
    borderRadius: "16px",
    background: "#4e4d4d",
  },
};
Modal.setAppElement("#root");

const SplashPage = ({ loginDone }) => {
  const [timerLeft, setTimerLeft] = useState();
  const [copies, setCopies] = useState();
  const [soldCopies, setSoldCopies] = useState();

  const [active, setActive] = useState({ policy: false, use: false });
  const GraymanSplashPageTESTNET = "0xbA947797AA2f1De2cD101d97B1aE6b04182fF3e6";
  const GreymanChainId = '0x89';
  const offerIndexInMarketplace = 2;
  const { primaryColor } = useSelector((store) => store.colorStore);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalVideoIsOpen, setVideoIsOpen] = useState(false);
  //   const history = useHistory();
  const { diamondMarketplaceInstance, contractCreator, currentUserAddress } = useSelector(
    (store) => store.contractStore
  );

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const openModalForVideo = useCallback(() => {
    setVideoIsOpen(true);
  }, []);

  function afterOpenModal() {
    subtitle.style.color = "#9013FE";
  }

  function closeModal() {
    setIsOpen(false);
    setVideoIsOpen(false);
    setActive((prev) => ({
      ...prev,
      policy: false,
      use: false,
    }));
  }

  const buyGrayman = async () => {
    if (window.ethereum.chainId !== GreymanChainId) {
      web3Switch(GreymanChainId);
      return;
    }
    if (!diamondMarketplaceInstance) {
      Swal.fire({
        title: "An error has ocurred",
        html: `Please try again later`,
        icon: "info",
      });
      return;
    }
    let greymanOffer = await metamaskCall(diamondMarketplaceInstance.getOfferInfo(offerIndexInMarketplace));
    if (greymanOffer) {
      let instance = contractCreator(GraymanSplashPageTESTNET, diamondFactoryAbi);
      let nextToken = await metamaskCall(instance.getNextSequentialIndex(
        greymanOffer.productIndex,
        greymanOffer.rangeData.rangeStart,
        greymanOffer.rangeData.rangeEnd
      ));
      Swal.fire({
        title: "Please wait...",
        html: `Buying Greyman #${nextToken.toString()}`,
        icon: "info",
        showConfirmButton: false,
      });
      if (await metamaskCall(
        diamondMarketplaceInstance.buyMintingOffer(
          offerIndexInMarketplace,
          nextToken,
          {
            value: greymanOffer.rangeData.rangePrice,
          }
        ),
        "Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!"
      )) {
        Swal.fire({
          // title : "Success", 
          imageUrl: GreyMan,
          imageHeight: "auto",
          imageWidth: "65%",
          imageAlt: 'GreyMan image',
          title: `You own #${nextToken}!`,
          icon: "success"
        });
      }
    }
  };

  const openVideo = () => {
    openModalForVideo();
  };

  const showVideoToLogginedUsers = () => {
    if (loginDone) {
      return (
        <>
          <img
            className="video-grey-man-pic"
            src={GreyMan}
            alt="community-img"
          />
          <div className="video-grey-man-metamask-logo-wrapper">
            <button
              style={{ border: "none", background: "none" }}
              className="video-grey-man-metamask-logo metamask-logo"
              onClick={() => openVideo()}
            >
              <img src={playImages} alt="Play" />
            </button>
          </div>
          <Modal
            isOpen={modalVideoIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStylesForVideo}
            contentLabel="Example Modal"
          >
            <h2
              className="video-grey-man-video-title"
              ref={(_subtitle) => (subtitle = _subtitle)}
            >
              Interview with artist Dadara.
            </h2>
            {/* <button onClick={closeModal}>close</button> */}
            <VideoPlayer />
          </Modal>
        </>
      );
    } else {
      return (
        <>
          <img
            className="video-grey-man-pic"
            src={GreyMan}
            alt="community-img"
          />
          <div className="video-grey-man-metamask-logo-wrapper">
            <button
              style={{ border: "none", background: "none" }}
              className="video-grey-man-metamask-logo metamask-logo"
              onClick={() => openVideo()}
            >
              <img src={playImages} alt="Play" />
            </button>
          </div>
          <Modal
            isOpen={modalVideoIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStylesForVideo}
            contentLabel="Example Modal"
          >
            <h2
              className="video-grey-man-video-title"
              ref={(_subtitle) => (subtitle = _subtitle)}
            >
              Interview with artist Dadara.
            </h2>
            {/* <button onClick={closeModal}>close</button> */}
            <VideoPlayer />
          </Modal>
        </>
      );
    }
  };

  let subtitle;

  const getAllProduct = useCallback(async () => {
    try {
      // console.log(diamondMarketplaceInstance, "diamondMarketplaceInstance")
      if (diamondMarketplaceInstance && window.ethereum && window.ethereum.chainId === GreymanChainId) {
        let responseAllProduct = await metamaskCall(diamondMarketplaceInstance.getOfferInfo(offerIndexInMarketplace));
        if (responseAllProduct) {
          let tokensInRange = responseAllProduct.rangeData.rangeEnd.sub(responseAllProduct.rangeData.rangeStart).add(2222);
          let soldTokens = tokensInRange.sub(responseAllProduct.rangeData.mintableTokens);
          setCopies(tokensInRange.toString());
          // setCopies(responseAllProduct.products[0].copies);
          // setSoldCopies(responseAllProduct.products[0].soldCopies);
          setSoldCopies(soldTokens.toString());
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [setSoldCopies, diamondMarketplaceInstance]);

  useEffect(() => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    diamondMarketplaceInstance.on('TokenMinted', getAllProduct);
    return diamondMarketplaceInstance.off('TokenMinted', getAllProduct);
  }, [diamondMarketplaceInstance, getAllProduct])

  useEffect(() => {
    setTitle(`#Cryptogreyman`);
  }, [])

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  return (
    <div className="wrapper-splash-page greyman-page">
      <div className="home-splash--page">
        <AuthorBlock mainClass="greyman-page-author">
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash greyman-page">
                <h3>
                  "All greymen are grey, but some are more grey than others." -
                  Dadara
                </h3>
                <h3
                  style={{
                    fontSize: "56px",
                    paddingBottom: "17px",
                    marginTop: "7rem",
                  }}
                  className="text-gradient-grey"
                >
                  #Cryptogreyman
                </h3>
              </div>
              {timerLeft === 0 && (
                <div className="text-description" style={{ color: "#A7A6A6" }}>
                  7.907.414.597 non-unique NFTs. All metadata is identical only
                  the serial number changes. Claim yours for <strong>1</strong> MATIC
                </div>
              )}
              {timerLeft !== 0 && (
                <div className="greyman-">
                  <Countdown
                    setTimerLeft={setTimerLeft}
                    time={"2022-02-22T22:22:00-00:00"}
                  />
                </div>
              )}
              <div className="btn-buy-metamask">
                {timerLeft === 0 && (
                  <button onClick={() => openModal()}>
                    <img
                      className="metamask-logo"
                      src={Metamask}
                      alt="metamask-logo"
                    />{" "}
                    Mint with Matic
                  </button>
                )}
              </div>
              <div className="btn-timer-nipsey">
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <h2
                    style={{
                      fontSize: "60px",
                      fontWeight: "bold",
                      paddingTop: "3rem",
                      cursor: "default",
                    }}
                    ref={(_subtitle) => (subtitle = _subtitle)}
                  >
                    Terms of Service
                  </h2>
                  {/* <button onClick={closeModal}>close</button> */}
                  <div className="modal-content-wrapper">
                    <div className="modal-form">
                      <form>
                        <div className="form-group">
                          <input type="checkbox" id="policy" />
                          <label
                            onClick={() =>
                              setActive((prev) => ({
                                ...prev,
                                policy: !prev.policy,
                              }))
                            }
                            htmlFor="policy"
                          >
                            I agree to the{" "}
                          </label>
                          <span
                            onClick={() => window.open("/privacy", "_blank")}
                            style={{
                              color: "#9013FE",
                              fontSize: "24px",
                              paddingRight: "1rem",
                              marginLeft: "-2.5rem",
                            }}
                          >
                            Privacy Policy
                          </span>
                        </div>
                        <div className="form-group sec-group ">
                          <input type="checkbox" className="dgdfgd" id="use" />
                          <label
                            onClick={() =>
                              setActive((prev) => ({ ...prev, use: !prev.use }))
                            }
                            htmlFor="use"
                          >
                            I accept the{" "}
                          </label>
                          <span
                            onClick={() => window.open("/terms-use", "_blank")}
                            style={{
                              color: "#9013FE",
                              fontSize: "24px",
                              paddingRight: "2.3rem",
                              marginLeft: "-2.5rem",
                            }}
                          >
                            Terms of Use
                          </span>
                        </div>
                      </form>
                    </div>
                    <div className="modal-content-np">
                      <div className="modal-text-wrapper">
                        <span style={{ width: '287px' }} className="modal-text">
                          By accepting these terms, I agree <strong style={{ color: "rgb(136 132 132)", fontWeight: 'bolder' }}>not</strong> to have any fun with this greyman
                        </span>
                        <img src={GreyManNotFun} alt="not-fun" />

                      </div>
                      <div className="modal-btn-wrapper">
                        <button
                          onClick={buyGrayman}
                          disabled={
                            currentUserAddress === undefined ||
                            !Object.values(active).every((el) => el)
                          }
                          className="modal-btn"
                        >
                          <img
                            style={{ width: "100px", marginLeft: "-1rem" }}
                            className="metamask-logo modal-btn-logo"
                            src={Metamask}
                            alt="metamask-logo"
                          />{" "}
                          {window.ethereum?.chainId !== GreymanChainId
                            ? "Switch network"
                            : currentUserAddress
                              ? "PURCHASE"
                              : "Connect your wallet!"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </AuthorBlock>
        {timerLeft === 0 && soldCopies !== undefined && (
          <TokenLeftGreyman
            Metamask={Metamask}
            primaryColor={primaryColor}
            soldCopies={soldCopies}
            copies={copies}
          />
        )}
        <div className="about-metadata-wrapper">
          {timerLeft === 0 && (
            <>
              <div className="about-metadata">
                <h1
                  style={{
                    color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                  }}
                >
                  <span style={{ color: "white" }}>What is </span>{" "}
                  <span style={{ color: "grey" }}>Metadata</span>
                </h1>
                <p
                  style={{
                    color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                  }}
                >
                  When a painting hangs on a wall, it’s always there for us to
                  enjoy. No electricity, no internet connection needed. No
                  distractions, pings, and notifications calling us while we try
                  to focus on the art. We can create our own bubble with the
                  physical piece of art. It’s always there for us. We can admire
                  the brush strokes from close by, and clearly see and feel that
                  not one of them is the same. And in a world where everything
                  is in flux and constant change, the painting is not changing,
                  inviting us to go deeper and deeper and discover more aspects
                  of it all the time. The painting remains the same, but our
                  perception of it and relationship to it becomes deeper and
                  more intimate.
                </p>
                <p
                  style={{
                    color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                  }}
                >
                  So why artificially limit our NFTs to a one of one? We can
                  create enough for everyone. There are 7.908.125.000 people on
                  this planet as of the time of writing. So, we created
                  7.908.125.000 NFTs. And all are identical. No rare traits or
                  characteristics which would artificially make one Greyman
                  worth more than another - each and every one of those Greymen
                  is exactly the same! The only thing that is different is their
                  numeric identification: you can obtain number 5, or number
                  1971, or number 3.427.903.612. And actually, that is exactly
                  what an NFT is about: it’s a number registered on the
                  blockchain. And isn’t that what nowadays is also identifying
                  us as human beings – just a number? After all, our social
                  security number is what defines us increasingly in our current
                  society. Or our geographical location, or our Metamask
                  address, or…..
                </p>
              </div>
              <div className="about-metadata-second-block-wrapper">
                <div className="about-metadata-second-block">
                  <p
                    style={{
                      color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                    }}
                  >
                    Metadata is how NFT serial numbers render information
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                    }}
                  >
                    The Greyman contract on the{" "}
                    <span
                      style={{
                        fontWeight: "bolder",
                        fontSize: "18px",
                        color: `${primaryColor === "rhyno" ? "#000" : "#c1c1c1"
                          }`,
                      }}
                    >
                      MATIC blockchain
                    </span>{" "}
                    points to{" "}
                    <span
                      style={{
                        fontWeight: "bolder",
                        fontSize: "18px",
                        color: `${primaryColor === "rhyno" ? "#000" : "#c1c1c1"
                          }`,
                      }}
                    >
                      {" "}
                      a metadata{" "}
                    </span>
                    JSON file with properties
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                    }}
                  >
                    MATIC works just like Ethereum, but is less expensive and
                    energy intense to point to metadata
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                    }}
                  >
                    The metadata files we point to are hosted on IPFS so they
                    don’t get lost, censored, or tampered with
                  </p>
                  <p
                    style={{
                      color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                    }}
                  >
                    Metadata is then rendered by any free browser
                  </p>
                </div>
                <div className="property-wrapper">
                  <div className="property-first-wrapper">
                    <div className="property-first">
                      <div
                        className="property"
                        style={{
                          background: `${primaryColor === "rhyno" ? "#cccccc" : "none"
                            }`,
                        }}
                      >
                        <span className="property-desc">Background Color</span>
                        <span className="property-name-color">Grey</span>
                        <span className="property-color">100%</span>
                      </div>
                    </div>
                    <div className="property-second">
                      <div
                        className="property second"
                        style={{
                          background: `${primaryColor === "rhyno" ? "#cccccc" : "none"
                            }`,
                        }}
                      >
                        <span className="property-desc">Pant Color</span>
                        <span className="property-name-color">Grey</span>
                        <span className="property-color">100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="property-btn-wrapper">
                    <a
                      href="https://rair.mypinata.cloud/ipfs/QmdJN6BzzYk5vJh1hQgGHGxT7GhVgrvNdArdFo9t9fgqLt"
                      target="_blank" rel="noreferrer"
                    >
                      <button className="property-btn">
                        View on IPFS
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="join-community">
          {timerLeft === 0 && (
            <>
              <div className="title-join">
                <h3>
                  <span>
                    Only <span className="text-gradient">7.907.414.597</span>{" "}
                    NFTs will ever be minted
                  </span>
                </h3>
              </div>
            </>
          )}
          <div className="main-greyman-pic-wrapper">
            {timerLeft === 0 && (
              <>
                <div className="main-greyman-pic">
                  <div className="join-pic-main">
                    <div className="show-more-wrap">
                      <span className="show-more" style={{ color: "#fff" }}>
                        Coming Soon <i className="fas fa-arrow-right"></i>{" "}
                      </span>
                    </div>
                    <img
                      className="join-pic-main-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                </div>
                <div className="list-of-greymans-pic">
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={GreyMan}
                      alt="community-img"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          {timerLeft === 0 && (
            <>
              <div className="exclusive-nfts">
                <MobileCarouselNfts>
                  <img
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                  <img
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                  <img
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                  <img
                    className="join-pic-img"
                    src={GreyMan}
                    alt="community-img"
                  />
                </MobileCarouselNfts>
              </div>
            </>
          )}
        </div>
        {timerLeft === 0 && (
          <>
            <div className="video-grey-man-wrapper">
              <p
                className="video-grey-man-title"
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#FFFFFF"}`,
                }}
              >
                For Greymen Only
              </p>
              <div className="video-grey-man">{showVideoToLogginedUsers()}</div>
              <div className="video-grey-man-desc-wrapper">
                <span
                  style={{
                    color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                  }}
                  className="video-grey-man-desc"
                >
                  NFT owners can learn more about the project by signing with
                  metamask to unlock an encrypted stream{" "}
                </span>
              </div>
            </div>

            <div className="greyman-timeline-wrapper">
              <h1
                style={{ color: "#6C6C6C" }}
                className="greyman-timeline-title"
              >
                Greyman <span style={{ color: "white" }}>Timeline</span>
              </h1>
            </div>
            <Timeline />
            <TeamMeet primaryColor={primaryColor} arraySplash={"greyman"} />
            <NotCommercial primaryColor={primaryColor} />
          </>
        )}
      </div>
    </div>
  );
};

export default SplashPage;
