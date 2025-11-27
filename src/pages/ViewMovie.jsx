import React, { Fragment, useEffect, useState } from "react";
import useApi from "../logic/useApi";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { Card, Divider, Row, Col, Rate, Button, Avatar, Tag, Spin } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import CustomTag from "../components/common/CustomTag";
import { exportToExcel, formatDate, getRemainingTime } from "../utils/utils";
import CustomButton from "../components/form/CustomButton";
import {
  PiCalendarFill,
  PiClockFill,
  PiGlobeFill,
  PiStarFill,
  PiUserFill,
  PiPlayCircleFill,
  PiFilmStripFill,
  PiMoneyFill,
  PiTrophyFill,
  PiChatCircleFill,
  PiArrowLeftFill,
} from "react-icons/pi";

export default function ViewMovie() {
  const [data, setData] = useState(null);
  const { callApi, loading } = useApi();
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    const { response, status } = await callApi({
      url: "/api/search",
      method: "get",
      params: {
        tt: id,
      },
    });

    if (status && response.ok) {
      setData(response);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" className="text-purple-400" />
          <div className="text-white mt-4">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-2xl mb-4">Movie not found</div>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Hero Section with Backdrop */}
      <div className="relative h-96 bg-linear-to-b from-transparent to-black/80">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${data?.top?.primaryImage?.url || data?.short?.image})`,
          }}
        />

        {/* Back Button */}
        <div className="relative z-10 p-6">
          <Button
            type="text"
            icon={<PiArrowLeftFill className="text-white text-xl" />}
            className="text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        {/* Movie Title and Basic Info */}
        <div className="relative z-10 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <Title level={1} className="text-white mb-4 text-5xl font-bold">
              {data?.short?.name || data?.top?.titleText?.text}
            </Title>

            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center gap-2">
                <PiCalendarFill className="text-yellow-400" />
                {
                  new Date(data?.short?.datePublished).getFullYear()}
              </span>
              <span className="flex items-center gap-2">
                <PiClockFill className="text-yellow-400" />
                {data?.top?.runtime?.displayableProperty?.value?.plainText}
              </span>
              <span className="flex items-center gap-2">
                <PiGlobeFill className="text-yellow-400" />
                {data?.short?.contentRating}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4">
              {(data?.top?.genres?.genres || data?.short?.genre || []).map((genre, index) => (
                <Tag key={index} className="bg-purple-600 text-white border-none">
                  {typeof genre === "string" ? genre : genre.text}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Row gutter={[32, 32]}>
          {/* Left Column - Movie Info */}
          <Col xs={24} lg={16}>
            {/* Poster and Overview */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <img
                    src={data?.short?.image || data?.top?.primaryImage?.url}
                    alt={data?.short?.name}
                    className="w-full rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                </Col>

                <Col xs={24} md={16}>
                  <div className="text-white">
                    <Title level={3} className="text-white mb-4">
                      Overview
                    </Title>
                    <Paragraph className="text-gray-300 text-lg leading-relaxed">
                      {data?.short?.description}
                    </Paragraph>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <PiStarFill className="text-yellow-400 text-2xl" />
                        <span className="text-2xl font-bold text-white">
                          {data?.short?.aggregateRating?.ratingValue}
                        </span>
                        <span className="text-gray-400">/10</span>
                      </div>
                      <span className="text-gray-400">
                        (
                        {(
                          data?.short?.aggregateRating?.ratingCount
                        )?.toLocaleString()}{" "}
                        votes)
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        type="primary"
                        size="large"
                        icon={<PiPlayCircleFill />}
                        className="bg-purple-600 hover:bg-purple-700 border-none"
                        onClick={() =>
                          window.open(
                            data?.short?.url || `https://www.imdb.com/title/${data?.imdbId}/`,
                            "_blank"
                          )
                        }
                      >
                        Watch Trailer
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Cast & Crew */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
              <Title level={3} className="text-white mb-6">
                Top Cast & Crew
              </Title>
              <Row gutter={[16, 16]}>
                {/* Director */}
                <Col xs={24} sm={12} md={8}>
                  <div className="text-white">
                    <div className="text-sm text-gray-400 mb-2">Director</div>
                    <div className="font-semibold">
                      {data?.top?.principalCreditsV2?.find(
                        (credit) => credit.grouping.text === "Director"
                      )?.credits?.[0]?.name?.nameText?.text ||
                        data?.short?.creator?.[0]?.name ||
                        "Sam Raimi"}
                    </div>
                  </div>
                </Col>

                {/* Writers */}
                <Col xs={24} sm={12} md={8}>
                  <div className="text-white">
                    <div className="text-sm text-gray-400 mb-2">Writers</div>
                    <div className="font-semibold">
                      {data?.top?.principalCreditsV2
                        ?.find((credit) => credit.grouping.text === "Writers")
                        ?.credits?.slice(0, 2)
                        .map((writer) => writer.name?.nameText?.text)
                        .join(", ")}
                    </div>
                  </div>
                </Col>

                {/* Stars */}
                <Col xs={24} sm={12} md={8}>
                  <div className="text-white">
                    <div className="text-sm text-gray-400 mb-2">Stars</div>
                    <div className="font-semibold">
                      {data?.top?.principalCreditsV2
                        ?.find((credit) => credit.grouping.text === "Stars")
                        ?.credits?.slice(0, 3)
                        .map((star) => star.name?.nameText?.text)
                        .join(", ")}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Box Office */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <Title level={3} className="text-white mb-6">
                Box Office
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <div className="text-white text-center">
                    <PiMoneyFill className="text-green-400 text-2xl mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Budget</div>
                    <div className="font-semibold">
                      ${(data?.top?.productionBudget?.budget?.amount / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-white text-center">
                    <PiTrophyFill className="text-yellow-400 text-2xl mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Worldwide</div>
                    <div className="font-semibold">
                      ${(data?.top?.worldwideGross?.total?.amount / 1000000).toFixed(0)}M
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-white text-center">
                    <PiStarFill className="text-purple-400 text-2xl mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Opening</div>
                    <div className="font-semibold">
                      $
                      {(data?.top?.openingWeekendGross?.gross?.total?.amount / 1000000).toFixed(1)}
                      M
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-white text-center">
                    <PiChatCircleFill className="text-blue-400 text-2xl mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Reviews</div>
                    <div className="font-semibold">
                      {data?.top?.reviews?.total?.toLocaleString()}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Additional Info */}
          <Col xs={24} lg={8}>
            {/* Details */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
              <Title level={4} className="text-white mb-4">
                Details
              </Title>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span className="text-gray-400">Release Date</span>
                  <span>
                    {new Date(
                      data?.short?.datePublished
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-gray-400">Country of Origin</span>
                  <span>United States</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-gray-400">Language</span>
                  <span>English</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-gray-400">Production Companies</span>
                  <span className="text-right">
                    {data?.top?.production?.edges
                      ?.slice(0, 2)
                      .map((company) => company?.node?.company?.companyText?.text)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </Card>

            {/* Did You Know */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
              <Title level={4} className="text-white mb-4">
                Did You Know?
              </Title>
              <div className="text-gray-300 text-sm">
                {data?.top?.trivia?.edges?.[0]?.node?.text?.plainText ||
                  "The first film to gross $100 million in its opening weekend alone. At the time, no movie had done so, even when adjusted for inflation."}
              </div>
            </Card>

            {/* User Reviews */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <Title level={4} className="text-white mb-4">
                User Reviews
              </Title>
              <div className="space-y-4">
                {data?.top?.featuredReviews?.edges?.slice(0, 2).map((review, index) => (
                  <div key={index} className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar size="small" className="bg-purple-600">
                        {review.node?.author?.username?.text?.[0]?.toUpperCase()}
                      </Avatar>
                      <span className="font-semibold text-sm">
                        {review.node?.author?.username?.text ||
                          review.node?.author?.nickName ||
                          "User"}
                      </span>
                      {review.node?.authorRating && (
                        <div className="flex items-center gap-1 ml-auto">
                          <PiStarFill className="text-yellow-400 text-xs" />
                          <span className="text-xs">{review.node.authorRating}/10</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 mb-1">
                      {review.node?.summary?.originalText}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-2">
                      {review.node?.text?.originalText?.originalText || review.node?.text?.originalText?.plainText}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
