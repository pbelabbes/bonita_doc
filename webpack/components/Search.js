// 1. Import Dependencies. =====================================================
import React, { Component } from 'react';
import {
  SearchBox,
  RefinementListFilter,
  Hits,
  HitsStats,
  SearchkitComponent,
  SelectedFilters,
  MenuFilter,
  HierarchicalMenuFilter,
  Pagination,
  ResetFilters,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  InitialLoader
} from "searchkit";

import * as _ from "lodash";


// 2. Connect elasticsearch with searchkit =====================================
// Set ES url - use a protected URL that only allows read actions.
// const ELASTICSEARCH_URL = 'https://doc-bonita-test-4287920661.us-west-2.bonsaisearch.net';
// const ELASTICSEARCH_URL = 'https://xCZhXB7YkE:pjbWUxmPNz2VYLh@doc-bonita-test-4287920661.us-west-2.bonsaisearch.net';

const url_domaine = "http://localhost:4000/bonita_doc"
// const url_domaine = "https://pbelabbes.github.io/bonita_doc"
const path_array = window.location.href.split(url_domaine)[1].split('/')
console.log(path_array) 

const docSite = path_array[1]
const version = path_array[2]


console.log(docSite)
console.log(version) 

const ELASTICSEARCH_URL = 'http://192.168.0.101:9200/'+docSite+"_"+version;
console.log(ELASTICSEARCH_URL)
const sk = new SearchkitManager(ELASTICSEARCH_URL, {});
console.log(sk);
// Custom hitItem display HTML.
const HitItem = (props) => (
 
  <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
    
    <a href={`${url_domaine}${props.result._source.url}`}>
      <div className={props.bemBlocks.item("title")}
        dangerouslySetInnerHTML={{ __html: _.get(props.result, "highlight.title", false) || props.result._source.title }}></div>
    </a>
    <div>
      <small className={props.bemBlocks.item("hightlights")}
        dangerouslySetInnerHTML={{ __html: _.get(props.result, "highlight.text", '') }}></small>
    </div>
  </div>
)

// Custom Hitstat

const customHitStats = (props) => {
  const { resultsFoundLabel, bemBlocks, hitsCount, timeTaken } = props
  return (
    <div className={bemBlocks.container()} data-qa="hits-stats">
      <div className={bemBlocks.container("info")} data-qa="info">
        We found {hitsCount} results
          </div>
    </div>
  )
}

// 3. Search UI. ===============================================================
class Search extends Component {

  constructor(props) {
    super(props);
    this.state = { resultsClass: "hide_block" };
    this.displayResults = this.displayResults.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * undisplay results if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ resultsClass: "hide_block" });
    }
  }

  displayResults() {
    this.setState({ resultsClass: "" });
  }

  render() {
    // const SearchkitProvider = SearchkitProvider;

    const Searchbox = SearchBox;
    

    var queryOpts = {
      analyzer: "standard"
    }

    return (
      <div ref={this.setWrapperRef}>
        <SearchkitProvider searchkit={sk} >
          <div className="search" onClick={this.displayResults}>
            <div className="search__query">
              {/* search input box */}
              <Searchbox searchOnChange={true}
                autoFocus={false}
                queryOptions={queryOpts}
                translations={{ "searchbox.placeholder": "Search", "NoHits.DidYouMean": "Search for {suggestion}." }}
                queryFields={["text", "title"]} />
            </div>
            <div className="_Search_display_wrapper">

              <div className={"search__results " + this.state.resultsClass} >
                
                {/* search results */}
                (   <Hits hitsPerPage={5}
                  highlightFields={["title", "text", "url"]}
                  itemComponent={HitItem} />
                  <Pagination showNumbers={true}/>
                {/* if there are no results */}
                <NoHits className="sk-hits" translations={{
                  "NoHits.NoResultsFound": "No results were found for ' {query} '",
                  "NoHits.DidYouMean": "Search for {suggestion}"
                }} suggestionsField="text" />

              </div>
            </div>
          </div >

        </SearchkitProvider>
      </div>
    )
  }
}
export default Search;