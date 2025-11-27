import { lazy } from "react";
import { BiHome } from "react-icons/bi";
import { FaVoteYea } from "react-icons/fa";
import { inProdMode } from "../utils/constants";
import ViewMovie from "../pages/ViewMovie";

const Movies = lazy(() => import("../pages/Movies"));

export const createRoutesConfig = (ctx = {}) => {
  return [
    {
      path: "/",
      label: "Movies",
      icon: FaVoteYea,
      Component: Movies,
      showInSidebar: "top",
      isPrivate: inProdMode,
      children: [
        {
          path: "/movies/:id",
          label: "View Movie",
          icon: FaVoteYea,
          Component: ViewMovie,
          isPrivate: inProdMode,
        },
      ],
    },
  ];
};
