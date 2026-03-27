import Swal from 'sweetalert2';

export const showAlert = (message, type = 'info') => {
    return Swal.fire({
        icon: type, // success | error | warning | info
        text: message,
        confirmButtonText: 'OK'
    });
};

export const showConfirm = async (message) => {
    const result = await Swal.fire({
        icon: 'warning',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    });

    return result.isConfirmed;
};