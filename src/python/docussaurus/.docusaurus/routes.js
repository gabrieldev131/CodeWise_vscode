import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/CodeWise/blog',
    component: ComponentCreator('/CodeWise/blog', '361'),
    exact: true
  },
  {
    path: '/CodeWise/blog/archive',
    component: ComponentCreator('/CodeWise/blog/archive', '41a'),
    exact: true
  },
  {
    path: '/CodeWise/blog/authors',
    component: ComponentCreator('/CodeWise/blog/authors', '72d'),
    exact: true
  },
  {
    path: '/CodeWise/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/CodeWise/blog/authors/all-sebastien-lorber-articles', '2e1'),
    exact: true
  },
  {
    path: '/CodeWise/blog/authors/yangshun',
    component: ComponentCreator('/CodeWise/blog/authors/yangshun', '01e'),
    exact: true
  },
  {
    path: '/CodeWise/blog/first-blog-post',
    component: ComponentCreator('/CodeWise/blog/first-blog-post', '2df'),
    exact: true
  },
  {
    path: '/CodeWise/blog/long-blog-post',
    component: ComponentCreator('/CodeWise/blog/long-blog-post', 'f25'),
    exact: true
  },
  {
    path: '/CodeWise/blog/mdx-blog-post',
    component: ComponentCreator('/CodeWise/blog/mdx-blog-post', '8ee'),
    exact: true
  },
  {
    path: '/CodeWise/blog/tags',
    component: ComponentCreator('/CodeWise/blog/tags', '6df'),
    exact: true
  },
  {
    path: '/CodeWise/blog/tags/docusaurus',
    component: ComponentCreator('/CodeWise/blog/tags/docusaurus', 'aac'),
    exact: true
  },
  {
    path: '/CodeWise/blog/tags/facebook',
    component: ComponentCreator('/CodeWise/blog/tags/facebook', '2c3'),
    exact: true
  },
  {
    path: '/CodeWise/blog/tags/hello',
    component: ComponentCreator('/CodeWise/blog/tags/hello', '58a'),
    exact: true
  },
  {
    path: '/CodeWise/blog/tags/hola',
    component: ComponentCreator('/CodeWise/blog/tags/hola', 'f6f'),
    exact: true
  },
  {
    path: '/CodeWise/blog/welcome',
    component: ComponentCreator('/CodeWise/blog/welcome', 'c71'),
    exact: true
  },
  {
    path: '/CodeWise/markdown-page',
    component: ComponentCreator('/CodeWise/markdown-page', 'be2'),
    exact: true
  },
  {
    path: '/CodeWise/docs',
    component: ComponentCreator('/CodeWise/docs', '97c'),
    routes: [
      {
        path: '/CodeWise/docs',
        component: ComponentCreator('/CodeWise/docs', 'fab'),
        routes: [
          {
            path: '/CodeWise/docs',
            component: ComponentCreator('/CodeWise/docs', '92b'),
            routes: [
              {
                path: '/CodeWise/docs/category/tutorial---basics',
                component: ComponentCreator('/CodeWise/docs/category/tutorial---basics', '912'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/category/tutorial---extras',
                component: ComponentCreator('/CodeWise/docs/category/tutorial---extras', '584'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/How was building/01-Design-of-the-architecture',
                component: ComponentCreator('/CodeWise/docs/How was building/01-Design-of-the-architecture', 'cc7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/How was building/02-Explanation-of-each-component-and-layer',
                component: ComponentCreator('/CodeWise/docs/How was building/02-Explanation-of-each-component-and-layer', '4e9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/How was building/03-Analysis-of-improvement-points-based-on-software-architecture-concepts',
                component: ComponentCreator('/CodeWise/docs/How was building/03-Analysis-of-improvement-points-based-on-software-architecture-concepts', '3d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/How was building/04-Bibliographical-references-on-the-adopted-architecture',
                component: ComponentCreator('/CodeWise/docs/How was building/04-Bibliographical-references-on-the-adopted-architecture', 'c01'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/intro',
                component: ComponentCreator('/CodeWise/docs/intro', '65f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/CodeWise/docs/tutorial-basics/congratulations', '775'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/CodeWise/docs/tutorial-basics/create-a-blog-post', '51d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/CodeWise/docs/tutorial-basics/create-a-document', '29f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/CodeWise/docs/tutorial-basics/create-a-page', '3d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/CodeWise/docs/tutorial-basics/deploy-your-site', 'aae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/CodeWise/docs/tutorial-basics/markdown-features', '5ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/CodeWise/docs/tutorial-extras/manage-docs-versions', '9b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/CodeWise/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/CodeWise/docs/tutorial-extras/translate-your-site', '4a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/CodeWise/',
    component: ComponentCreator('/CodeWise/', '8ac'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
