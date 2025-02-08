import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6"
import { Link } from "react-router"
import { Button } from "../ui/button"

const Footer = () => {
  return (


    <footer className="bg-stone-800 text-white text-center py-4">
      <div className="flex flex-col sm:flex-row justify-center items-center w-10/12 mx-auto">
        <div className="flex-shrink w-40"></div>
        <p className="flex-grow">&copy; 2025 QAIRx. All rights reserved.</p>
        <div className="w-40">
          <Link to="https://www.facebook.com/pharmacyatQUB/">
            <Button variant="link" className="text-stone-50 hover:text-stone-50/80">
              <FaFacebookF />
            </Button>
          </Link>
          <Link to="https://x.com/pharmacyatQUB">
            <Button variant="link" className="text-stone-50 hover:text-stone-50/80">
              <FaXTwitter />
            </Button>
          </Link>
          <Link to="https://www.instagram.com/pharmacyatqub/">
            <Button variant="link" className="text-stone-50 hover:text-stone-50/80">
              <FaInstagram />
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer